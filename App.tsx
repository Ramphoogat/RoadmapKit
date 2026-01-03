import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import RoadmapBuilderWrapper from './components/RoadmapBuilder';
import TemplatesPage from './components/TemplatesPage';
import ShowcasePage from './components/ShowcasePage';
import PricingPage from './components/PricingPage';
import AboutPage from './components/AboutPage';
import { SavedTemplate, OFFICIAL_TEMPLATES, MOCK_PUBLIC_TEMPLATES } from './types';

export default function App() {
  const [mode, setMode] = useState<'landing' | 'builder' | 'templates' | 'showcase' | 'pricing' | 'about'>('landing');
  const [currentTemplate, setCurrentTemplate] = useState<SavedTemplate | undefined>(undefined);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  
  // Load my templates from local storage
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('neo-roadmap-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load templates", e);
      return [];
    }
  });

  // Load public templates (Mock + LocalStorage Simulation)
  const [publicTemplates, setPublicTemplates] = useState<SavedTemplate[]>(() => {
    try {
        const saved = localStorage.getItem('neo-roadmap-public');
        const userPublished = saved ? JSON.parse(saved) : [];
        return [...OFFICIAL_TEMPLATES, ...MOCK_PUBLIC_TEMPLATES, ...userPublished];
    } catch (e) {
        return [...OFFICIAL_TEMPLATES, ...MOCK_PUBLIC_TEMPLATES];
    }
  });

  const handleStart = (template?: SavedTemplate) => {
    setCurrentTemplate(template);
    setReadOnlyMode(false);
    setMode('builder');
  };

  const handleViewShowcase = (template: SavedTemplate) => {
      setCurrentTemplate(template);
      setReadOnlyMode(true);
      setMode('builder');
  };

  const handleExit = () => {
    if (readOnlyMode) {
        setMode('showcase');
    } else {
        setMode('landing');
    }
    setCurrentTemplate(undefined);
    setReadOnlyMode(false);
  };

  const handleSaveTemplate = (template: SavedTemplate) => {
    setSavedTemplates(prev => {
      // Remove existing if updating, add new at top
      const filtered = prev.filter(t => t.id !== template.id);
      const updated = [template, ...filtered];
      localStorage.setItem('neo-roadmap-templates', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteTemplate = (id: string) => {
    // Confirmation handled in UI components
    setSavedTemplates(prev => {
        const updated = prev.filter(t => t.id !== id);
        localStorage.setItem('neo-roadmap-templates', JSON.stringify(updated));
        return updated;
    });
  };

  const handlePublishTemplate = (id: string, isPublic: boolean, tags?: string[]) => {
      // 1. Update local saved template
      const templateToUpdate = savedTemplates.find(t => t.id === id);
      if (!templateToUpdate) return;

      const updatedTemplate = { ...templateToUpdate, isPublic, tags: tags || templateToUpdate.tags, author: 'You' };
      handleSaveTemplate(updatedTemplate);

      // 2. Update Public Registry
      setPublicTemplates(prev => {
          let updatedPublic = [...prev];
          
          if (isPublic) {
              // Add or Update
              updatedPublic = updatedPublic.filter(t => t.id !== id);
              updatedPublic.unshift(updatedTemplate);
          } else {
              // Remove
              updatedPublic = updatedPublic.filter(t => t.id !== id);
          }
          
          // Filter out official/mocks from localStorage save to avoid dupes
          const userPublished = updatedPublic.filter(t => t.source === 'custom' || t.source === 'imported');
          localStorage.setItem('neo-roadmap-public', JSON.stringify(userPublished));

          return updatedPublic;
      });
  };

  const handleFork = (template: SavedTemplate) => {
      // Forking logic: New ID, add to my templates, switch to edit mode
      const newTemplate: SavedTemplate = {
          ...template,
          id: Math.random().toString(36).substr(2, 9),
          title: `Copy of ${template.title}`,
          source: 'custom',
          author: undefined,
          isPublic: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
      };
      handleSaveTemplate(newTemplate);
      setCurrentTemplate(newTemplate);
      setReadOnlyMode(false); // Switch to edit mode
      alert('Template imported! You can now edit it.');
  };

  return (
    <div className="font-sans antialiased text-black">
      {mode === 'landing' ? (
        <Landing 
            onStart={handleStart} 
            onSaveTemplate={handleSaveTemplate}
            onViewTemplates={() => setMode('templates')}
            onViewShowcase={() => setMode('showcase')}
            onNavigate={(page) => setMode(page)}
        />
      ) : mode === 'templates' ? (
        <TemplatesPage
            onBack={() => setMode('landing')}
            onStart={handleStart}
            savedTemplates={savedTemplates}
            onDeleteTemplate={handleDeleteTemplate}
            onSaveTemplate={handleSaveTemplate}
            onPublishTemplate={handlePublishTemplate}
            onNavigate={(page) => setMode(page)}
        />
      ) : mode === 'showcase' ? (
        <ShowcasePage 
            onBack={() => setMode('landing')}
            onView={handleViewShowcase}
            publicTemplates={publicTemplates}
            onNavigate={(page) => setMode(page)}
        />
      ) : mode === 'pricing' ? (
        <PricingPage 
            onBack={() => setMode('landing')}
            onNavigate={(page) => setMode(page)}
        />
      ) : mode === 'about' ? (
        <AboutPage 
            onBack={() => setMode('landing')}
            onNavigate={(page) => setMode(page)}
        />
      ) : (
        <RoadmapBuilderWrapper 
            onExit={handleExit} 
            initialTemplate={currentTemplate} 
            onSaveTemplate={handleSaveTemplate}
            readOnly={readOnlyMode}
            onFork={(template) => {
                handleFork(template);
            }}
        />
      )}
    </div>
  );
}