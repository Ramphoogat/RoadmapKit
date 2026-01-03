import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoButton, NeoCard, NeoInput, NeoSelect } from './NeoComponents';
import { Search, MoveLeft, Eye, Heart, Calendar, User, Copy, Loader2, Globe, Github } from 'lucide-react';
import { SavedTemplate } from '../types';

interface ShowcasePageProps {
    onBack: () => void;
    onView: (template: SavedTemplate) => void;
    publicTemplates: SavedTemplate[];
    onNavigate: (page: 'landing' | 'templates' | 'showcase' | 'pricing' | 'about') => void;
}

export default function ShowcasePage({ onBack, onView, publicTemplates, onNavigate }: ShowcasePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'popular' | 'newest' | 'alphabetical'>('popular');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    publicTemplates.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [publicTemplates]);

  // Filter and Sort Logic
  const filteredTemplates = useMemo(() => {
    let result = [...publicTemplates];

    // Search
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(t => 
            t.title.toLowerCase().includes(lower) || 
            t.author?.toLowerCase().includes(lower) ||
            t.tags?.some(tag => tag.toLowerCase().includes(lower))
        );
    }

    // Filter by Tag
    if (filterTag !== 'all') {
        result = result.filter(t => t.tags?.includes(filterTag));
    }

    // Sort
    if (sortOption === 'popular') {
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortOption === 'newest') {
        result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === 'alphabetical') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [publicTemplates, searchTerm, sortOption, filterTag]);

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
            <button onClick={() => onNavigate('showcase')} className="text-neo-pink transition-colors">Showcase</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-neo-pink transition-colors">Pricing</button>
            <button onClick={() => onNavigate('about')} className="hover:text-neo-pink transition-colors">About</button>
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

      <main className="flex-1 flex flex-col items-center p-6">
        <div className="max-w-7xl w-full mb-12 mt-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">
                    Explore Community <span className="text-neo-pink">Roadmaps</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Discover learning paths created by developers worldwide. Clone, customize, and start learning.
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white border-2 border-black p-6 shadow-neo mb-12 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        className="w-full pl-12 pr-4 py-3 font-bold border-2 border-black focus:outline-none focus:shadow-neo transition-shadow bg-white"
                        placeholder="Search roadmaps, tags, or authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        className="p-3 font-bold border-2 border-black bg-white focus:outline-none focus:shadow-neo cursor-pointer"
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>

                    <select 
                        className="p-3 font-bold border-2 border-black bg-white focus:outline-none focus:shadow-neo cursor-pointer"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as any)}
                    >
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {filteredTemplates.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-black border-dashed opacity-70">
                    <Globe size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-2xl font-bold mb-2">No roadmaps found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTemplates.map((template) => (
                        <motion.div 
                            key={template.id}
                            whileHover={{ y: -8 }}
                            className="bg-white border-2 border-black shadow-neo hover:shadow-neo-xl transition-all group flex flex-col h-full cursor-pointer"
                            onClick={() => onView(template)}
                        >
                             {/* Thumbnail */}
                             <div 
                                className="h-48 bg-neo-offwhite border-b-2 border-black flex items-center justify-center overflow-hidden bg-cover bg-center relative"
                                style={template.thumbnail ? { backgroundImage: `url(${template.thumbnail})` } : {}}
                             >
                                 {!template.thumbnail && (
                                    <div className="opacity-10 text-6xl">🌍</div>
                                 )}
                                 <div className="absolute top-3 right-3 flex gap-2">
                                     {template.likes && template.likes > 500 && (
                                         <span className="bg-neo-orange text-black text-[10px] font-black px-2 py-1 border-2 border-black uppercase">Trending</span>
                                     )}
                                     {(Date.now() - template.createdAt < 7 * 24 * 60 * 60 * 1000) && (
                                         <span className="bg-neo-lime text-black text-[10px] font-black px-2 py-1 border-2 border-black uppercase">New</span>
                                     )}
                                 </div>
                             </div>

                             <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-xl font-black leading-tight mb-2 line-clamp-2 group-hover:text-neo-pink transition-colors">
                                    {template.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4">
                                    <User size={14} />
                                    <span>{template.author || 'Anonymous'}</span>
                                    <span className="mx-1">•</span>
                                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {template.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 border border-black">{tag}</span>
                                    ))}
                                    {template.tags && template.tags.length > 3 && (
                                        <span className="text-[10px] font-bold text-gray-500 self-center">+{template.tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                                    <div className="flex gap-4 text-xs font-bold text-gray-400">
                                        <div className="flex items-center gap-1"><Eye size={14}/> {template.views || 0}</div>
                                        <div className="flex items-center gap-1"><Heart size={14}/> {template.likes || 0}</div>
                                    </div>
                                    <span className="text-neo-cyan font-bold text-sm flex items-center gap-1 group-hover:underline">
                                        View Roadmap <MoveLeft size={16} className="rotate-180" />
                                    </span>
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </main>

      <footer className="relative z-10 p-8 text-center font-bold border-t-2 border-black bg-neo-offwhite text-sm">
         <p>DESIGNED BY ROADMAPKIT TEAM © 2024</p>
      </footer>
    </div>
  );
}