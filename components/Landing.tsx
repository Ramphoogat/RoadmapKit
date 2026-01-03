import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeoButton, NeoCard } from './NeoComponents';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Node } from 'reactflow';
import { NodeData, SavedTemplate } from '../types';

interface LandingProps {
    onStart: (template?: SavedTemplate) => void;
    onSaveTemplate: (template: SavedTemplate) => void;
    onViewTemplates: () => void;
    onViewShowcase: () => void;
    onNavigate: (page: 'landing' | 'templates' | 'showcase' | 'pricing' | 'about') => void;
}

export default function Landing({ onStart, onSaveTemplate, onViewTemplates, onViewShowcase, onNavigate }: LandingProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple Auto-Layout Algorithm
  const layoutNodes = (nodes: any[], edges: any[] = []): Node<NodeData>[] => {
    // Safety checks
    if (!Array.isArray(nodes)) {
        console.error("layoutNodes received invalid nodes array:", nodes);
        return [];
    }
    const safeEdges = Array.isArray(edges) ? edges : [];

    const layoutedNodes: Node<NodeData>[] = [];
    const levelMap = new Map<string, number>();
    const nodeMap = new Map<string, any>(nodes.map(n => [n.id, n]));
    
    // Build adjacency list
    const adj = new Map<string, string[]>();
    safeEdges.forEach(e => {
        if (!e || !e.source || !e.target) return;
        if (!adj.has(e.source)) adj.set(e.source, []);
        adj.get(e.source)?.push(e.target);
    });

    // Find roots (nodes with no incoming edges)
    const targets = new Set(safeEdges.map(e => e.target));
    const roots = nodes.filter(n => !targets.has(n.id));

    // BFS for levels
    const queue = roots.map(r => ({ id: r.id, level: 0 }));
    const visited = new Set<string>();

    while(queue.length > 0) {
        const { id, level } = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        levelMap.set(id, level);

        const children = adj.get(id) || [];
        children.forEach(childId => {
            queue.push({ id: childId, level: level + 1 });
        });
    }

    // Assign positions based on level and index in level
    const levelGroups = new Map<number, string[]>();
    levelMap.forEach((level, id) => {
        if (!levelGroups.has(level)) levelGroups.set(level, []);
        levelGroups.get(level)?.push(id);
    });

    levelGroups.forEach((ids, level) => {
        ids.forEach((id, index) => {
            const node = nodeMap.get(id);
            if (!node) return;

            const x = index * 350 + (level % 2 === 0 ? 0 : 100); // Stagger slightly
            const y = level * 250 + 100;
            
            // Fix: Wrap properties in 'data' object
            layoutedNodes.push({
                id: node.id,
                position: { x, y },
                type: 'customNode', // Force custom node type
                data: {
                    label: node.label,
                    description: node.description,
                    type: node.type,
                    emoji: node.emoji
                }
            });
        });
    });

    // Handle disconnected nodes (fallback)
    nodes.forEach(n => {
        if (!visited.has(n.id)) {
            // Fix: Wrap properties in 'data' object
            layoutedNodes.push({
                id: n.id,
                position: { x: Math.random() * 500, y: Math.random() * 500 },
                type: 'customNode',
                data: {
                    label: n.label,
                    description: n.description,
                    type: n.type,
                    emoji: n.emoji
                }
            });
        }
    });

    return layoutedNodes;
  };

  const handleImport = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    console.log("[Import] Starting process for:", urlInput);

    try {
        let topic = urlInput;
        let fetchedContext = "";

        // 1. Parse URL/Topic
        try {
            if (urlInput.startsWith('http')) {
                const urlObj = new URL(urlInput);
                const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                if (pathSegments.length > 0) {
                    topic = pathSegments[pathSegments.length - 1].replace(/-/g, ' ');
                }
                console.log("[Import] Derived topic from URL:", topic);

                // 2. Fetch Content via Proxy (CORS Bypass)
                console.log("[Import] Attempting to fetch content via proxy...");
                try {
                    // Using allorigins to bypass CORS
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(urlInput)}`;
                    const response = await fetch(proxyUrl);
                    
                    if (!response.ok) {
                        throw new Error(`Proxy responded with status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    if (data.contents) {
                        // Parse HTML to plain text to reduce noise for AI
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data.contents, 'text/html');
                        
                        // Clean up scripts, styles, etc.
                        doc.querySelectorAll('script, style, svg, noscript, iframe').forEach(el => el.remove());
                        
                        fetchedContext = doc.body.innerText.replace(/\s+/g, ' ').slice(0, 15000); // Limit context size
                        console.log("[Import] Successfully fetched content. Length:", fetchedContext.length);
                    } else {
                        console.warn("[Import] Proxy returned empty content");
                    }
                } catch (fetchErr) {
                    console.warn("[Import] Fetch failed, falling back to generation mode:", fetchErr);
                    // Non-fatal: Proceed with topic generation
                }
            }
        } catch (e) {
            console.warn("[Import] URL parsing error, treating as topic string");
            topic = urlInput;
        }
        
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);

        // 3. AI Generation
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let prompt = "";
        if (fetchedContext) {
            prompt = `
                I have content from a webpage about '${topic}'. 
                Analyze this content and extract a structured learning roadmap.
                
                CONTENT START:
                ${fetchedContext}
                CONTENT END

                You MUST respond with ONLY valid JSON in this exact format, no markdown, no explanation.
                Return a JSON object with 'nodes' and 'edges'.
                Nodes must have: id, label (short title), description (1 sentence), type (beginner/intermediate/advanced/framework/optional), emoji.
                Create edges to connect them logically.
            `;
        } else {
            prompt = `
                Generate a learning roadmap for '${topic}'. 
                You MUST respond with ONLY valid JSON in this exact format, no markdown, no explanation.
                Return a JSON object with 'nodes' and 'edges'. 
                Create at least 8-12 nodes representing key concepts, arranged logically from beginner to advanced.
                
                Nodes must have:
                - id: string (unique)
                - label: string (short title)
                - description: string (1 sentence summary)
                - type: one of ['beginner', 'intermediate', 'advanced', 'framework', 'optional']
                - emoji: string (relevant single emoji)
                
                Edges must have:
                - id: string
                - source: string (node id)
                - target: string (node id)
            `;
        }

        console.log("[Import] Sending request to Gemini...");
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nodes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    emoji: { type: Type.STRING }
                                }
                            }
                        },
                        edges: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    source: { type: Type.STRING },
                                    target: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (response.text) {
            console.log("[Import] Raw AI response text:", response.text);
            
            // Clean markdown code blocks if present (Gemini sometimes adds them even in JSON mode)
            let jsonString = response.text;
            if (jsonString.includes('```')) {
                jsonString = jsonString.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            jsonString = jsonString.trim();

            let data;
            try {
                data = JSON.parse(jsonString);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                throw new Error("Failed to parse AI response. The model returned invalid JSON.");
            }
            
            console.log('[Import] Parsed Data:', data);

            // Validate and Sanitize
            if (!data) throw new Error("AI returned empty data");
            
            const safeNodes = Array.isArray(data.nodes) ? data.nodes : [];
            const safeEdges = Array.isArray(data.edges) ? data.edges : [];

            if (safeNodes.length === 0) {
                throw new Error("AI returned a valid response but it contained no roadmap nodes.");
            }

            console.log(`[Import] Processing ${safeNodes.length} nodes and ${safeEdges.length} edges`);

            const nodesWithLayout = layoutNodes(safeNodes, safeEdges);
            
            // Transform edges to ReactFlow format
            const formattedEdges = safeEdges.map((e: any) => ({
                ...e,
                id: e.id || `e-${e.source}-${e.target}`, // Ensure ID exists
                animated: true,
                style: { strokeWidth: 3, stroke: '#000' }
            }));

            const newTemplate: SavedTemplate = {
                id: Math.random().toString(36).substr(2, 9),
                title: topic,
                source: 'imported',
                sourceUrl: urlInput.includes('http') ? urlInput : undefined,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                nodes: nodesWithLayout,
                edges: formattedEdges
            };

            onSaveTemplate(newTemplate);
            onStart(newTemplate);
        } else {
            throw new Error("No text returned from AI");
        }

    } catch (err: any) {
        console.error("[Import Error]", err);
        setError(err.message || "Failed to import. Check console for details.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-neo-offwhite flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b-2 border-black bg-neo-offwhite">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neo-cyan border-2 border-black"></div>
            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none">RoadmapKit</span>
                <span className="text-[10px] font-bold text-gray-600 leading-none mt-0.5">Simple, clear, developer-friendly</span>
            </div>
        </div>
        <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide">
            <button onClick={() => onNavigate('templates')} className="hover:text-neo-pink transition-colors">Templates</button>
            <button onClick={() => onNavigate('showcase')} className="hover:text-neo-pink transition-colors">Showcase</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-neo-pink transition-colors">Pricing</button>
            <button onClick={() => onNavigate('about')} className="hover:text-neo-pink transition-colors">About</button>
        </div>
        <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border-2 border-black">
                <span className="text-xs">👤</span>
             </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full mb-16 mt-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black tracking-tight leading-none">
            Find your <br />
            <span className="text-neo-cyan">Learning Path</span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto text-gray-700">
            Visualise your career trajectory. Drag, drop, and connect nodes to build your personalized roadmap.
          </p>

          {/* Search Bar Style CTA */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8 bg-transparent relative z-20">
             <div className="flex-1 relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search size={20} className="text-gray-400 group-focus-within:text-neo-pink transition-colors"/>
                 </div>
                 <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    placeholder="Paste URL (e.g. roadmap.sh/react) or topic..." 
                    className="w-full pl-12 pr-4 py-4 border-2 border-black font-bold bg-white focus:outline-none focus:shadow-neo transition-all"
                 />
             </div>
             <div className="w-full md:w-auto relative">
                <div className="absolute inset-0 bg-black translate-x-1 translate-y-1"></div>
                <button 
                    onClick={handleImport}
                    disabled={isLoading}
                    className="relative w-full md:w-auto px-10 py-4 bg-neo-pink text-white font-bold border-2 border-black hover:-translate-y-1 hover:-translate-x-1 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'IMPORT'}
                </button>
             </div>
          </div>
          
          <div className="mb-12 h-6">
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm bg-red-50 border-2 border-red-500 py-2 px-4 inline-flex"
                >
                    <AlertCircle size={16} /> {error}
                </motion.div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">OR START FRESH</p>
            <button 
                onClick={() => onStart()} 
                className="text-black underline font-bold hover:text-neo-cyan"
            >
                Create blank roadmap &rarr;
            </button>
          </div>

           {/* Stats / Tags */}
           <div className="flex flex-wrap justify-center gap-4 mb-16">
             <div className="px-4 py-2 border-2 border-black bg-white font-bold text-sm shadow-neo flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neo-green"></div> 250+ Templates
             </div>
             <div className="px-4 py-2 border-2 border-black bg-white font-bold text-sm shadow-neo flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neo-orange"></div> Free Export
             </div>
             <div className="px-4 py-2 border-2 border-black bg-white font-bold text-sm shadow-neo flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neo-purple"></div> Open Source
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
             <NeoCard className="bg-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-black bg-neo-yellow flex items-center justify-center text-2xl">⚡️</div>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-neo-green text-xs font-bold border border-black text-white">ACTIVE</span>
                        <span className="px-2 py-1 bg-neo-orange text-xs font-bold border border-black">NEW</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Frontend Developer Path</h3>
                <p className="text-sm text-gray-500 mb-4">Meta, Facebook</p>
                <ul className="text-sm space-y-2 mb-6 list-disc list-inside">
                    <li>HTML, CSS, JavaScript essentials</li>
                    <li>React ecosystem & State management</li>
                </ul>
                <NeoButton onClick={() => onViewTemplates()} className="w-full" variant="primary">Browse Templates</NeoButton>
             </NeoCard>

             <NeoCard className="bg-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-black bg-neo-cyan flex items-center justify-center text-2xl">🤖</div>
                     <div className="flex gap-2">
                        <span className="px-2 py-1 bg-black text-xs font-bold border border-black text-white">PRO</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Machine Learning Engineer</h3>
                <p className="text-sm text-gray-500 mb-4">Google</p>
                <ul className="text-sm space-y-2 mb-6 list-disc list-inside">
                    <li>Python proficiency & Math basics</li>
                    <li>TensorFlow & Neural Networks</li>
                </ul>
                <NeoButton onClick={() => onViewTemplates()} className="w-full" variant="secondary">Browse Templates</NeoButton>
             </NeoCard>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 p-8 text-center font-bold border-t-2 border-black bg-neo-offwhite text-sm">
         <p>DESIGNED BY ROADMAPKIT TEAM © 2024</p>
      </footer>
    </div>
  );
}