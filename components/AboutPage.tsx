import React from 'react';
import { motion } from 'framer-motion';
import { NeoButton, NeoCard } from './NeoComponents';
import { MoveLeft, Heart, Code, Zap, Users, Globe, Cpu, Layers, Github } from 'lucide-react';

interface AboutPageProps {
    onBack: () => void;
    onNavigate: (page: 'landing' | 'templates' | 'showcase' | 'pricing' | 'about') => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
    const values = [
        { icon: <Zap size={24} />, title: "Simplicity", desc: "Complex learning made simple. We remove the clutter so you can focus on the path.", color: "bg-neo-yellow" },
        { icon: <Globe size={24} />, title: "Accessibility", desc: "Knowledge should be free. Our basic tools will always be open to everyone.", color: "bg-neo-cyan" },
        { icon: <Users size={24} />, title: "Community", desc: "Built with and for learners. We thrive on feedback and shared knowledge.", color: "bg-neo-pink" },
        { icon: <Code size={24} />, title: "Innovation", desc: "Constantly improving. We leverage the latest tech to enhance learning.", color: "bg-neo-lime" }
    ];

    const techStack = [
        { name: "React", icon: "⚛️" },
        { name: "TypeScript", icon: "📘" },
        { name: "Tailwind", icon: "🎨" },
        { name: "React Flow", icon: "🔗" },
        { name: "Gemini AI", icon: "🧠" },
        { name: "Framer", icon: "✨" }
    ];

    return (
        <div className="min-h-screen bg-neo-offwhite font-sans flex flex-col">
            {/* Navbar */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b-2 border-black bg-neo-offwhite">
                <div className="flex items-center gap-6">
                    <div onClick={() => onNavigate('landing')} className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-neo-cyan border-2 border-black"></div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none">RoadmapKit</span>
                            <span className="text-[10px] font-bold text-gray-600 leading-none mt-0.5">Simple, clear, developer-friendly</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide">
                    <button onClick={() => onNavigate('templates')} className="hover:text-neo-pink transition-colors">Templates</button>
                    <button onClick={() => onNavigate('showcase')} className="hover:text-neo-pink transition-colors">Showcase</button>
                    <button onClick={() => onNavigate('pricing')} className="hover:text-neo-pink transition-colors">Pricing</button>
                    <button onClick={() => onNavigate('about')} className="text-neo-pink transition-colors">About</button>
                </div>
                <div className="flex gap-4 items-center">
                     <a 
                        href="https://github.com/Ramphoogat/RoadmapKit" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-neo-offwhite shadow-neo transition-all active:translate-y-[2px] active:shadow-none"
                     >
                        <Github size={20} />
                     </a>
                     <NeoButton onClick={onBack} variant="ghost" className="!px-4 !py-2 !border-2 !border-black" icon={<MoveLeft size={16}/>}>Back</NeoButton>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center p-6 text-center">
                <div className="max-w-5xl w-full mb-12 mt-8">
                    
                    {/* Hero */}
                    <div className="mb-24">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold mb-6 text-black tracking-tight leading-tight"
                        >
                            Building the Future of <br/><span className="bg-neo-yellow px-4 border-2 border-black shadow-neo inline-block transform -rotate-2">Learning Paths</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-700 max-w-2xl mx-auto font-medium"
                        >
                            We believe everyone deserves a clear roadmap to achieve their goals. No more getting lost in tutorial hell.
                        </motion.p>
                    </div>

                    {/* Mission */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 text-left">
                        <div className="bg-white border-2 border-black p-8 shadow-neo-lg relative">
                            <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-1 font-bold text-sm uppercase">Our Mission</div>
                            <p className="text-lg leading-relaxed font-medium mb-4">
                                RoadmapKit was created to solve a simple but pervasive problem: <span className="bg-neo-pink/30 px-1 font-bold">Information Overload</span>.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                When starting a new skill, the abundance of resources can be paralyzing. We provide the tools to visualize, structure, and track your learning journey, turning chaos into a clear path forward.
                            </p>
                        </div>
                        <div>
                             <h2 className="text-4xl font-black uppercase mb-6">How It Started</h2>
                             <div className="border-l-4 border-black pl-6 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[34px] top-1 w-4 h-4 bg-neo-cyan border-2 border-black rounded-full"></div>
                                    <h4 className="font-bold text-xl">2023</h4>
                                    <p className="text-gray-600">Started as a side project to help friends learn React.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[34px] top-1 w-4 h-4 bg-neo-orange border-2 border-black rounded-full"></div>
                                    <h4 className="font-bold text-xl">2024</h4>
                                    <p className="text-gray-600">Launched RoadmapKit v1.0 with drag-and-drop builder.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[34px] top-1 w-4 h-4 bg-neo-purple border-2 border-black rounded-full"></div>
                                    <h4 className="font-bold text-xl">Future</h4>
                                    <p className="text-gray-600">AI-driven personalization and community features.</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-24">
                        <h2 className="text-4xl font-black uppercase mb-12">What We Stand For</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((v, i) => (
                                <NeoCard key={i} className={`h-full flex flex-col items-center text-center ${v.color}`}>
                                    <div className="bg-white border-2 border-black p-3 mb-4 shadow-sm rounded-full">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-xl font-bold uppercase mb-2">{v.title}</h3>
                                    <p className="text-sm font-medium opacity-80">{v.desc}</p>
                                </NeoCard>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-black text-white border-2 border-black p-12 mb-24 shadow-neo-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 grid grid-cols-6 gap-1 transform -rotate-12 scale-150 opacity-10">
                            {[...Array(24)].map((_, i) => <div key={i} className="h-full bg-white/10"></div>)}
                        </div>
                        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-neo-yellow mb-2">10k+</div>
                                <div className="text-xs font-bold uppercase tracking-widest">Roadmaps Created</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-neo-lime mb-2">50+</div>
                                <div className="text-xs font-bold uppercase tracking-widest">Templates</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-neo-cyan mb-2">5k+</div>
                                <div className="text-xs font-bold uppercase tracking-widest">Active Users</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-neo-pink mb-2">99%</div>
                                <div className="text-xs font-bold uppercase tracking-widest">Satisfaction</div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-24">
                        <h2 className="text-2xl font-black uppercase mb-8 flex items-center justify-center gap-2">
                            <Cpu size={24}/> Built With Modern Tech
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {techStack.map((tech, i) => (
                                <div key={i} className="bg-white border-2 border-black px-4 py-2 font-bold shadow-neo flex items-center gap-2 hover:-translate-y-1 transition-transform cursor-default">
                                    <span className="text-lg">{tech.icon}</span> {tech.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-neo-cyan border-2 border-black p-12 text-center shadow-neo relative overflow-hidden">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            Start Building Your Roadmap Today
                        </h2>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <NeoButton onClick={() => onNavigate('landing')} variant="primary" className="!text-lg !px-8 !py-4">Create Free Roadmap</NeoButton>
                            <NeoButton onClick={() => onNavigate('showcase')} variant="secondary" className="!text-lg !px-8 !py-4">View Showcase</NeoButton>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="relative z-10 p-8 text-center font-bold border-t-2 border-black bg-neo-offwhite text-sm">
                <div className="flex justify-center gap-6 mb-4 text-xs uppercase tracking-widest opacity-60">
                    <a href="#" className="hover:text-neo-pink">Twitter</a>
                    <a href="#" className="hover:text-neo-pink">GitHub</a>
                    <a href="#" className="hover:text-neo-pink">Discord</a>
                    <a href="#" className="hover:text-neo-pink">Email</a>
                </div>
                <p>DESIGNED BY ROADMAPKIT TEAM © 2024</p>
            </footer>
        </div>
    );
}