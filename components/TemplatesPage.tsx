import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoButton, NeoModal, NeoInput } from './NeoComponents';
import { Layout, Trash2, Edit3, X, MoveLeft, Globe, Lock, Check } from 'lucide-react';
import { SavedTemplate, OFFICIAL_TEMPLATES } from '../types';

interface TemplatesPageProps {
    onBack: () => void;
    onStart: (template?: SavedTemplate) => void;
    savedTemplates: SavedTemplate[];
    onSaveTemplate: (template: SavedTemplate) => void;
    onDeleteTemplate: (id: string) => void;
    onPublishTemplate: (id: string, isPublic: boolean, tags?: string[]) => void;
    onNavigate: (page: 'landing' | 'templates' | 'showcase' | 'pricing' | 'about') => void;
}

export default function TemplatesPage({ onBack, onStart, savedTemplates, onSaveTemplate, onDeleteTemplate, onPublishTemplate, onNavigate }: TemplatesPageProps) {
  const [activeTab, setActiveTab] = useState<'official' | 'mine'>('official');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<SavedTemplate | null>(null);
  
  // Publish State
  const [publishModalId, setPublishModalId] = useState<string | null>(null);
  const [publishTags, setPublishTags] = useState('');

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
        const template = savedTemplates.find(t => t.id === deleteId);
        if (template) {
            setLastDeleted(template);
            onDeleteTemplate(deleteId);
            setDeleteId(null);
            setShowUndoToast(true);
            setTimeout(() => setShowUndoToast(false), 5000);
        }
    }
  };

  const handleUndo = () => {
    if (lastDeleted) {
        onSaveTemplate(lastDeleted);
        setShowUndoToast(false);
        setLastDeleted(null);
    }
  };

  const handlePublishClick = (template: SavedTemplate) => {
      if (template.isPublic) {
          // If already public, make private immediately
          onPublishTemplate(template.id, false);
      } else {
          // Open modal to confirm publishing
          setPublishModalId(template.id);
          setPublishTags(template.tags?.join(', ') || '');
      }
  };

  const confirmPublish = () => {
      if (publishModalId) {
          const tags = publishTags.split(',').map(t => t.trim()).filter(Boolean);
          onPublishTemplate(publishModalId, true, tags);
          setPublishModalId(null);
          setPublishTags('');
      }
  };

  const displayedTemplates = activeTab === 'official' ? OFFICIAL_TEMPLATES : savedTemplates;

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
            <button onClick={() => onNavigate('templates')} className="text-neo-pink transition-colors">Templates</button>
            <button onClick={() => onNavigate('showcase')} className="hover:text-neo-pink transition-colors">Showcase</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-neo-pink transition-colors">Pricing</button>
            <button onClick={() => onNavigate('about')} className="hover:text-neo-pink transition-colors">About</button>
        </div>
        <div className="flex gap-4">
             <NeoButton onClick={onBack} variant="ghost" className="!px-4 !py-2 !border-2 !border-black" icon={<MoveLeft size={16}/>}>Back</NeoButton>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center p-6 text-center">
        <div className="max-w-6xl w-full mb-20 mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-black text-left">
                Browse <span className="text-neo-pink">Templates</span>
            </h1>

            <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab('official')}
                        className={`text-xl font-bold uppercase px-4 py-2 border-2 border-black transition-all ${activeTab === 'official' ? 'bg-neo-yellow shadow-neo translate-y-[-4px]' : 'bg-white hover:bg-gray-100'}`}
                    >
                        Official Templates
                    </button>
                    <button 
                        onClick={() => setActiveTab('mine')}
                        className={`text-xl font-bold uppercase px-4 py-2 border-2 border-black transition-all ${activeTab === 'mine' ? 'bg-neo-purple text-white shadow-neo translate-y-[-4px]' : 'bg-white hover:bg-gray-100'}`}
                    >
                        My Templates ({savedTemplates.length})
                    </button>
                </div>
            </div>

            {displayedTemplates.length === 0 ? (
                <div className="bg-white border-2 border-black p-12 shadow-neo flex flex-col items-center">
                    <div className="w-20 h-20 bg-neo-offwhite rounded-full border-2 border-black flex items-center justify-center mb-6">
                        <Layout size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No templates yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Create a roadmap from the home page to see it here.
                    </p>
                    <NeoButton onClick={onBack}>Go to Home</NeoButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    <AnimatePresence mode='popLayout'>
                        {displayedTemplates.map((template) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                key={template.id}
                                className="bg-white border-2 border-black shadow-neo group relative overflow-hidden flex flex-col h-full"
                            >
                                {/* New Badge */}
                                {(Date.now() - template.createdAt < 7 * 24 * 60 * 60 * 1000) && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-neo-pink text-white text-xs font-black px-2 py-1 border-2 border-black shadow-sm">NEW</span>
                                    </div>
                                )}

                                {/* Thumbnail Placeholder */}
                                <div 
                                    className="h-40 bg-neo-offwhite border-b-2 border-black flex items-center justify-center overflow-hidden bg-cover bg-center shrink-0"
                                    style={template.thumbnail ? { backgroundImage: `url(${template.thumbnail})` } : {}}
                                >
                                    {!template.thumbnail && (
                                        <div className="opacity-10 text-6xl">🗺️</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button 
                                            onClick={() => onStart(template)}
                                            className="bg-neo-cyan text-white font-bold px-4 py-2 border-2 border-black shadow-neo hover:scale-105 transition-transform"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold leading-tight line-clamp-2">{template.title}</h3>
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                                            template.source === 'imported' ? 'bg-neo-orange' : 
                                            template.source === 'official' ? 'bg-neo-yellow' : 'bg-neo-lime'
                                        }`}>
                                            {template.source}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase py-0.5">
                                            {new Date(template.updatedAt).toLocaleDateString()}
                                        </span>
                                        {template.isPublic && (
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-black bg-neo-cyan text-white flex items-center gap-1">
                                                <Globe size={8}/> Public
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 mt-auto">
                                        <div className="flex gap-0 border-t-2 border-gray-100 pt-3">
                                            <button onClick={() => onStart(template)} className="flex-1 flex items-center justify-center gap-1 text-xs font-bold hover:bg-gray-100 py-3 border-2 border-transparent hover:border-black transition-all">
                                                <Edit3 size={14} /> USE TEMPLATE
                                            </button>
                                            {activeTab === 'mine' && (
                                                <button 
                                                    onClick={() => handleDeleteClick(template.id)} 
                                                    className="w-12 flex items-center justify-center bg-white text-black border-l-2 border-transparent hover:border-black hover:bg-neo-pink hover:text-white transition-all border-y-2"
                                                    title="Delete Template"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        {activeTab === 'mine' && (
                                            <button 
                                                onClick={() => handlePublishClick(template)}
                                                className={`w-full text-[10px] font-bold py-1 flex items-center justify-center gap-1 border-2 border-black ${template.isPublic ? 'bg-neo-green/20' : 'bg-gray-100 hover:bg-neo-cyan hover:text-white transition-colors'}`}
                                            >
                                                {template.isPublic ? (
                                                    <><Check size={12}/> Published to Showcase</>
                                                ) : (
                                                    <><Globe size={12}/> Make Public</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
      </main>

        {/* Delete Modal */}
        <NeoModal 
            isOpen={!!deleteId} 
            onClose={() => setDeleteId(null)} 
            title="Delete Roadmap?"
        >
            <p className="font-medium text-lg mb-8 text-left">
                Are you sure you want to delete <span className="font-bold bg-neo-pink/20 px-1 border-b-2 border-neo-pink">
                    {savedTemplates.find(t => t.id === deleteId)?.title}
                </span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
                <NeoButton variant="secondary" onClick={() => setDeleteId(null)}>Cancel</NeoButton>
                <NeoButton variant="danger" onClick={confirmDelete}>Delete</NeoButton>
            </div>
        </NeoModal>

        {/* Publish Modal */}
        <NeoModal 
            isOpen={!!publishModalId} 
            onClose={() => setPublishModalId(null)} 
            title="Share with Community?"
        >
            <p className="font-medium text-lg mb-4 text-left">
                Your roadmap will be visible to everyone in the Showcase. You can make it private anytime.
            </p>
            
            <div className="mb-8 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Tags (Optional)</label>
                <NeoInput 
                    placeholder="e.g. React, Frontend, Beginner" 
                    value={publishTags}
                    onChange={(e) => setPublishTags(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">Separate tags with commas.</p>
            </div>

            <div className="flex justify-end gap-4">
                <NeoButton variant="secondary" onClick={() => setPublishModalId(null)}>Cancel</NeoButton>
                <NeoButton variant="primary" onClick={confirmPublish} icon={<Globe size={16}/>}>Make Public</NeoButton>
            </div>
        </NeoModal>

        <AnimatePresence>
            {showUndoToast && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 border-2 border-white shadow-neo flex items-center gap-6"
                >
                    <span className="font-bold">Roadmap deleted successfully</span>
                    <button onClick={handleUndo} className="text-neo-yellow hover:text-white font-black uppercase tracking-wide hover:underline">Undo</button>
                    <button onClick={() => setShowUndoToast(false)} className="hover:text-red-400 transition-colors">
                        <X size={18}/>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}