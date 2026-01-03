import React, { useState } from 'react';
import { Node } from 'reactflow';
import { NodeData, Resource, ResourceType } from '../types';
import { NeoModal, NeoButton, NeoInput, NeoTextArea, NeoSelect, NeoCard } from './NeoComponents';
import { BookOpen, Video, MonitorPlay, Code2, Rss, ExternalLink, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    node: Node<NodeData> | null;
    onUpdateNode: (id: string, data: Partial<NodeData>) => void;
}

const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
    'Article': 'bg-neo-yellow',
    'Video': 'bg-neo-purple text-white',
    'Course': 'bg-neo-orange',
    'OpenSource': 'bg-black text-white',
    'Feed': 'bg-neo-pink text-white',
    'Custom': 'bg-neo-cyan text-white'
};

const RESOURCE_ICONS: Record<ResourceType, React.ReactNode> = {
    'Article': <BookOpen size={14} />,
    'Video': <Video size={14} />,
    'Course': <MonitorPlay size={14} />,
    'OpenSource': <Code2 size={14} />,
    'Feed': <Rss size={14} />,
    'Custom': <ExternalLink size={14} />
};

export default function ResourceModal({ isOpen, onClose, node, onUpdateNode }: ResourceModalProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState('');
    
    // Form State
    const [newResTitle, setNewResTitle] = useState('');
    const [newResUrl, setNewResUrl] = useState('');
    const [newResType, setNewResType] = useState<ResourceType>('Article');
    const [newResIsPremium, setNewResIsPremium] = useState(false);
    const [newResDiscount, setNewResDiscount] = useState('');

    if (!node) return null;

    const resources = node.data.resources || [];
    const freeResources = resources.filter(r => !r.isPremium);
    const premiumResources = resources.filter(r => r.isPremium);

    const handleSaveDescription = () => {
        onUpdateNode(node.id, { description: descriptionDraft });
        setIsEditingDescription(false);
    };

    const startEditDescription = () => {
        setDescriptionDraft(node.data.description || '');
        setIsEditingDescription(true);
    };

    const handleAddResource = () => {
        if (!newResTitle || !newResUrl) return;
        
        const newResource: Resource = {
            id: Math.random().toString(36).substr(2, 9),
            type: newResType,
            title: newResTitle,
            url: newResUrl,
            isPremium: newResIsPremium,
            discount: newResIsPremium ? newResDiscount : undefined
        };

        const updatedResources = [...resources, newResource];
        onUpdateNode(node.id, { resources: updatedResources });
        
        // Reset form
        setIsAdding(false);
        setNewResTitle('');
        setNewResUrl('');
        setNewResType('Article');
        setNewResIsPremium(false);
        setNewResDiscount('');
    };

    const handleDeleteResource = (resId: string) => {
        if (confirm('Delete this resource?')) {
            const updatedResources = resources.filter(r => r.id !== resId);
            onUpdateNode(node.id, { resources: updatedResources });
        }
    };

    const renderResourceList = (list: Resource[], title: string) => (
        <div className="mb-6">
            <h4 className="font-bold text-lg mb-3 uppercase tracking-wider flex items-center gap-2">
                {title} <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">{list.length}</span>
            </h4>
            {list.length === 0 ? (
                <div className="text-gray-500 italic text-sm border-2 border-dashed border-gray-300 p-4 text-center">
                    No {title.toLowerCase()} added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {list.map(res => (
                        <div key={res.id} className="group bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-neo transition-all flex justify-between items-center">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`shrink-0 ${RESOURCE_TYPE_COLORS[res.type]} border-2 border-black p-1.5 flex items-center justify-center`}>
                                    {RESOURCE_ICONS[res.type]}
                                </span>
                                <div className="min-w-0">
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline truncate block text-lg leading-tight">
                                        {res.title}
                                    </a>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 px-1 border border-black">
                                            {res.type}
                                        </span>
                                        {res.discount && (
                                            <span className="text-[10px] font-bold text-white bg-green-600 px-1 border border-black flex items-center gap-0.5">
                                                <AlertCircle size={8} /> {res.discount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDeleteResource(res.id)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <NeoModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Node Resources"
            maxWidth="max-w-3xl"
        >
            {/* Header Section */}
            <div className="mb-8 border-b-2 border-black pb-6">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-3xl font-black">{node.data.emoji} {node.data.label}</h2>
                    <span className={`px-3 py-1 font-bold text-xs uppercase border-2 border-black ${
                        node.data.type === 'beginner' ? 'bg-neo-lime' :
                        node.data.type === 'intermediate' ? 'bg-neo-yellow' : 'bg-neo-orange'
                    }`}>
                        {node.data.type}
                    </span>
                </div>
                
                {isEditingDescription ? (
                    <div className="mt-4">
                        <NeoTextArea 
                            value={descriptionDraft}
                            onChange={(e) => setDescriptionDraft(e.target.value)}
                            className="h-24 mb-2 text-sm"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSaveDescription} className="bg-black text-white px-3 py-1 text-xs font-bold uppercase hover:bg-gray-800">Save</button>
                            <button onClick={() => setIsEditingDescription(false)} className="bg-gray-200 px-3 py-1 text-xs font-bold uppercase hover:bg-gray-300">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="group relative mt-2">
                        <p className="text-gray-700 leading-relaxed pr-8">
                            {node.data.description || "No description provided."}
                        </p>
                        <button 
                            onClick={startEditDescription}
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-neo-yellow border-2 border-transparent hover:border-black transition-all"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Resources Section */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold border-l-4 border-neo-cyan pl-3">Learning Materials</h3>
                {!isAdding && (
                    <NeoButton onClick={() => setIsAdding(true)} variant="primary" className="!py-2 !px-4 !text-xs" icon={<Plus size={14} />}>
                        Add Resource
                    </NeoButton>
                )}
            </div>

            {isAdding && (
                <div className="mb-8 bg-neo-offwhite border-2 border-black p-4 shadow-neo animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-bold mb-4 uppercase text-sm">New Resource</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Title</label>
                            <NeoInput value={newResTitle} onChange={e => setNewResTitle(e.target.value)} placeholder="e.g. React Official Docs" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Type</label>
                            <NeoSelect value={newResType} onChange={e => setNewResType(e.target.value as ResourceType)}>
                                {Object.keys(RESOURCE_TYPE_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
                            </NeoSelect>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase mb-1">URL</label>
                            <NeoInput value={newResUrl} onChange={e => setNewResUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                             <input 
                                type="checkbox" 
                                id="isPremium" 
                                className="w-5 h-5 border-2 border-black accent-neo-pink"
                                checked={newResIsPremium}
                                onChange={e => setNewResIsPremium(e.target.checked)}
                             />
                             <label htmlFor="isPremium" className="font-bold text-sm cursor-pointer select-none">Is Premium / Paid?</label>
                        </div>
                        {newResIsPremium && (
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Discount (Optional)</label>
                                <NeoInput value={newResDiscount} onChange={e => setNewResDiscount(e.target.value)} placeholder="e.g. 50% Off" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 justify-end">
                        <NeoButton variant="secondary" onClick={() => setIsAdding(false)} className="!py-2">Cancel</NeoButton>
                        <NeoButton variant="accent" onClick={handleAddResource} className="!py-2">Save Resource</NeoButton>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {renderResourceList(freeResources, "Free Resources")}
                {renderResourceList(premiumResources, "Premium Resources")}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-gray-200 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                Press ESC to close
            </div>
        </NeoModal>
    );
}