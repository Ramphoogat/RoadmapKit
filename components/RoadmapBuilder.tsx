import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  MarkerType,
  Node,
  useReactFlow,
  Panel,
} from 'reactflow';
import html2canvas from 'html2canvas';
import { Download, Share2, Save, MoveLeft, Plus, Trash2, Settings, Grid3X3, Edit3, Copy, Eye } from 'lucide-react';

import CustomNode from './CustomNode';
import ResourceModal from './ResourceModal';
import { NeoButton, NeoCard, NeoInput, NeoTextArea, NeoSelect } from './NeoComponents';
import { NodeData, NodeType, DEFAULT_NODES, DEFAULT_EDGES, RoadmapTemplate, SavedTemplate } from '../types';

const nodeTypes = {
  customNode: CustomNode,
};

// --- Sidebar for Drag & Drop ---
const Sidebar = ({ readOnly }: { readOnly?: boolean }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (readOnly) {
      return (
        <aside className="w-64 h-full bg-neo-offwhite border-r-2 border-black flex flex-col p-6 text-center justify-center">
             <div className="mb-4 text-gray-400">
                 <Eye size={48} className="mx-auto mb-2" />
             </div>
             <h3 className="font-bold text-lg mb-2">View Only</h3>
             <p className="text-sm text-gray-500">
                 You are viewing a public roadmap. Import it to your templates to edit.
             </p>
        </aside>
      )
  }

  return (
    <aside className="w-64 h-full bg-neo-offwhite border-r-2 border-black flex flex-col overflow-y-auto">
      <div className="p-4 border-b-2 border-black bg-neo-offwhite">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <Grid3X3 size={20} /> Library
        </h2>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {Object.values(NodeType).map((type) => (
          <div
            key={type}
            className="p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing font-bold capitalize flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            onDragStart={(event) => onDragStart(event, type as NodeType, `New ${type}`)}
            draggable
          >
            <div className={`w-4 h-4 border-2 border-black rounded-sm ${
                type === NodeType.BEGINNER ? 'bg-neo-lime' :
                type === NodeType.INTERMEDIATE ? 'bg-neo-yellow' :
                type === NodeType.ADVANCED ? 'bg-neo-orange' :
                type === NodeType.FRAMEWORK ? 'bg-neo-purple' :
                type === NodeType.OPTIONAL ? 'bg-neo-cyan' : 'bg-neo-pink'
            }`} />
            {type}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t-2 border-black bg-neo-yellow/20">
        <p className="text-xs font-bold text-center opacity-60">DRAG ELEMENTS TO CANVAS</p>
      </div>
    </aside>
  );
};

// --- Properties Panel ---
const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode, readOnly }: { 
    selectedNode: Node<NodeData> | null, 
    onUpdateNode: (id: string, data: Partial<NodeData>) => void,
    onDeleteNode: (id: string) => void,
    readOnly?: boolean
}) => {
    if (!selectedNode) {
        return (
            <aside className="w-80 h-full bg-neo-offwhite border-l-2 border-black p-6 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-4 shadow-neo">
                    <Settings size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{readOnly ? 'Node Details' : 'Properties'}</h3>
                <p className="text-sm text-gray-600 max-w-[200px]">Select a node on the canvas to view its details.</p>
            </aside>
        );
    }

    if (readOnly) {
        return (
            <aside className="w-80 h-full bg-neo-offwhite border-l-2 border-black flex flex-col overflow-y-auto">
                <div className="p-4 border-b-2 border-black bg-white">
                    <h2 className="text-xl font-bold">Node Info</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</span>
                        <div className="text-xl font-black">{selectedNode.data.label}</div>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Type</span>
                        <div className="font-bold capitalize flex items-center gap-2 mt-1">
                             <div className={`w-3 h-3 rounded-full border border-black ${
                                selectedNode.data.type === NodeType.BEGINNER ? 'bg-neo-lime' :
                                selectedNode.data.type === NodeType.INTERMEDIATE ? 'bg-neo-yellow' :
                                selectedNode.data.type === NodeType.ADVANCED ? 'bg-neo-orange' :
                                selectedNode.data.type === NodeType.FRAMEWORK ? 'bg-neo-purple' : 'bg-neo-pink'
                             }`} />
                            {selectedNode.data.type}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</span>
                        <div className="mt-2 text-sm leading-relaxed border-2 border-black/10 p-3 bg-white">
                            {selectedNode.data.description || 'No description provided.'}
                        </div>
                    </div>
                </div>
            </aside>
        )
    }

    return (
        <aside className="w-80 h-full bg-neo-offwhite border-l-2 border-black flex flex-col overflow-y-auto">
            <div className="p-4 border-b-2 border-black bg-white">
                <h2 className="text-xl font-bold">Edit Node</h2>
            </div>
            
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Title</label>
                    <NeoInput 
                        value={selectedNode.data.label} 
                        onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                        placeholder="Node Title"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Type</label>
                    <NeoSelect
                        value={selectedNode.data.type}
                        onChange={(e) => onUpdateNode(selectedNode.id, { type: e.target.value as NodeType })}
                    >
                        {Object.values(NodeType).map(t => (
                            <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                    </NeoSelect>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Icon (Emoji)</label>
                    <NeoInput 
                        value={selectedNode.data.emoji || ''} 
                        onChange={(e) => onUpdateNode(selectedNode.id, { emoji: e.target.value })}
                        maxLength={2}
                        placeholder="🚀"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                    <NeoTextArea 
                        value={selectedNode.data.description || ''} 
                        onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
                        placeholder="Add a brief description..."
                    />
                </div>

                <div className="pt-6 border-t-2 border-black/10">
                    <NeoButton 
                        variant="primary" 
                        className="w-full !bg-black !text-white hover:!bg-gray-800"
                        onClick={() => onDeleteNode(selectedNode.id)}
                        icon={<Trash2 size={16} />}
                    >
                        Delete Node
                    </NeoButton>
                </div>
            </div>
        </aside>
    );
};

// --- Main Flow Component ---
const RoadmapFlow = ({ onExit, initialNodes, initialEdges, onSaveTemplate, initialTitle, initialId, readOnly, onFork }: { 
    onExit: () => void, 
    initialNodes?: Node<NodeData>[], 
    initialEdges?: Edge[],
    onSaveTemplate?: (template: SavedTemplate) => void,
    onFork?: () => void,
    initialTitle?: string,
    initialId?: string,
    readOnly?: boolean
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes || DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || DEFAULT_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [resourceModalNodeId, setResourceModalNodeId] = useState<string | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState(initialTitle || 'My RoadmapKit');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { project, fitView } = useReactFlow();

  // Fit view on init if new data is passed
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
        setTimeout(() => fitView(), 100);
    }
  }, [initialNodes, fitView]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
        ...params, 
        style: { strokeWidth: 2, stroke: '#000' },
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      const label = event.dataTransfer.getData('application/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<NodeData> = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'customNode',
        position,
        data: { 
            label: label || 'New Node', 
            type: type,
            description: 'Add description...',
            emoji: '✨',
            resources: []
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    // Check if clicked element was the resources trigger button
    const target = event.target as HTMLElement;
    if (target.closest('.resource-trigger-button')) {
        setResourceModalNodeId(node.id);
        return;
    }
    
    setSelectedNodeId(node.id);
  };

  const onNodeDoubleClick = (_: React.MouseEvent, node: Node) => {
      setResourceModalNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const updateNodeData = (id: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setSelectedNodeId(null);
  };

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const resourceModalNode = useMemo(() => {
      return nodes.find(n => n.id === resourceModalNodeId) || null;
  }, [nodes, resourceModalNodeId]);

  const exportImage = async () => {
    if (reactFlowWrapper.current) {
        const canvas = await html2canvas(reactFlowWrapper.current, {
            backgroundColor: '#FDF6E3',
            ignoreElements: (element) => {
                return element.classList.contains('react-flow__controls') || 
                       element.classList.contains('react-flow__panel');
            }
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${roadmapTitle.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
    }
  };

  const handleSave = async () => {
      let thumbnail = undefined;
      // Capture Thumbnail
      if (reactFlowWrapper.current) {
          try {
              const canvas = await html2canvas(reactFlowWrapper.current, {
                  backgroundColor: '#FDF6E3',
                  scale: 0.5, // Lower resolution for thumbnail
                  ignoreElements: (element) => {
                    return element.classList.contains('react-flow__controls') || 
                           element.classList.contains('react-flow__panel');
                  }
              });
              thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          } catch(e) {
              console.error("Failed to generate thumbnail", e);
          }
      }

      const template: SavedTemplate = {
          id: initialId || Math.random().toString(36).substr(2, 9),
          title: roadmapTitle,
          nodes: nodes,
          edges: edges,
          source: 'custom',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          thumbnail: thumbnail
      };

      if (onSaveTemplate) {
          onSaveTemplate(template);
          alert('Roadmap saved to templates successfully!');
      }
  };

  return (
    <div className="h-screen flex flex-col bg-neo-offwhite overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-20 bg-neo-offwhite border-b-2 border-black flex items-center justify-between px-8 z-10 shrink-0">
            <div className="flex items-center gap-6">
                <button onClick={onExit} className="hover:underline font-bold flex items-center gap-2">
                    <MoveLeft size={20} /> Back
                </button>
                <div className="w-[2px] h-8 bg-black/20"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neo-cyan rounded-full border-2 border-black flex items-center justify-center font-black text-white">
                        RK
                    </div>
                    <div>
                        {(!readOnly && isEditingTitle) ? (
                            <input 
                                value={roadmapTitle}
                                onChange={(e) => setRoadmapTitle(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                autoFocus
                                className="font-bold text-xl leading-none bg-transparent border-b-2 border-black focus:outline-none"
                            />
                        ) : (
                            <h1 
                                className={`font-bold text-xl leading-none flex items-center gap-2 ${!readOnly ? 'cursor-pointer hover:text-neo-pink' : ''}`}
                                onClick={() => !readOnly && setIsEditingTitle(true)}
                            >
                                {roadmapTitle} {!readOnly && <Edit3 size={14} className="opacity-30" />}
                            </h1>
                        )}
                        <p className="text-xs text-gray-500 font-medium">{readOnly ? 'View Only Mode' : 'Build 2024'}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <NeoButton variant="secondary" onClick={exportImage} icon={<Download size={18} />}>
                    Export
                </NeoButton>
                {readOnly ? (
                     <NeoButton onClick={onFork} variant="primary" icon={<Copy size={18} />} className="!bg-neo-purple">
                        Import to My Templates
                    </NeoButton>
                ) : (
                    <NeoButton onClick={handleSave} variant="primary" icon={<Save size={18} />} className="!bg-neo-pink">
                        Save Roadmap
                    </NeoButton>
                )}
            </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
            <Sidebar readOnly={readOnly} />
            
            <div className="flex-1 relative bg-neo-offwhite" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={!readOnly ? onNodesChange : undefined}
                    onEdgesChange={!readOnly ? onEdgesChange : undefined}
                    onConnect={!readOnly ? onConnect : undefined}
                    onInit={instance => instance.fitView()}
                    onDrop={!readOnly ? onDrop : undefined}
                    onDragOver={!readOnly ? onDragOver : undefined}
                    onNodeClick={onNodeClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    connectionLineStyle={{ stroke: '#000', strokeWidth: 2 }}
                    snapToGrid={true}
                    snapGrid={[20, 20]}
                    nodesDraggable={!readOnly}
                    nodesConnectable={!readOnly}
                    elementsSelectable={true}
                >
                    <Background color="#000" gap={25} size={1} variant={BackgroundVariant.Dots} className="opacity-[0.15]" />
                    <Controls className="!bg-white !border-2 !border-black !shadow-neo !rounded-none [&>button]:!border-black [&>button]:!border-b-2 last:[&>button]:!border-b-0 [&>button:hover]:!bg-neo-yellow" />
                    
                    <Panel position="bottom-center" className="bg-white border-2 border-black px-4 py-2 shadow-neo mb-4">
                        <p className="text-xs font-bold uppercase tracking-widest">{readOnly ? 'Read Only' : 'Canvas Active'}</p>
                    </Panel>
                </ReactFlow>
            </div>

            <PropertiesPanel 
                selectedNode={selectedNode} 
                onUpdateNode={updateNodeData}
                onDeleteNode={deleteNode}
                readOnly={readOnly}
            />
        </div>

        {/* Resources Modal */}
        <ResourceModal 
            isOpen={!!resourceModalNodeId} 
            onClose={() => setResourceModalNodeId(null)} 
            node={resourceModalNode}
            onUpdateNode={updateNodeData}
        />
    </div>
  );
};

export default function RoadmapBuilderWrapper({ onExit, initialTemplate, onSaveTemplate, readOnly, onFork }: { 
    onExit: () => void, 
    initialTemplate?: SavedTemplate,
    onSaveTemplate?: (template: SavedTemplate) => void,
    onFork?: (template: SavedTemplate) => void,
    readOnly?: boolean
}) {
    // If we fork, we need to pass the current state, but RoadmapFlow manages state internally.
    // The simplest way is to let RoadmapFlow handle the fork logic with the button, but we need to pass a callback that takes the data.
    // Wait, RoadmapFlow has the state (nodes/edges). 
    // We can just modify onSaveTemplate to act as "Save Copy" if readOnly? 
    // Actually better to pass a distinct onFork callback that RoadmapFlow calls with the current data.
    
    // For now, let's implement onFork in RoadmapFlow similar to handleSave but creating a new ID.
    const handleForkInternal = (templateData: SavedTemplate) => {
         if (onFork) {
             const newTemplate = {
                 ...templateData,
                 id: Math.random().toString(36).substr(2, 9),
                 title: `Copy of ${templateData.title}`,
                 source: 'custom' as const,
                 createdAt: Date.now(),
                 updatedAt: Date.now(),
                 isPublic: false
             };
             onFork(newTemplate);
         }
    };

    return (
        <ReactFlowProvider>
            <RoadmapFlow 
                onExit={onExit} 
                initialNodes={initialTemplate?.nodes}
                initialEdges={initialTemplate?.edges}
                onSaveTemplate={onSaveTemplate}
                onFork={() => {
                    // We need access to nodes/edges inside RoadmapFlow.
                    // To avoid complexity, we can just pass a specialized "onSaveTemplate" that behaves like fork if readOnly?
                    // No, let's pass a wrapper.
                    // Actually, we can't easily access the state from here. 
                    // Let's pass the logic INTO RoadmapFlow.
                    // The RoadmapFlow component above now calls onSaveTemplate with the constructed object.
                    // I'll update RoadmapFlow to accept onFork and call it with the template object.
                }}
                // We need to implement the actual fork call inside RoadmapFlow, so I'll patch RoadmapFlow above to take a simple prop
                // and construct the object there.
                
                // Re-passing the prop to the inner component:
                initialTitle={initialTemplate?.title}
                initialId={initialTemplate?.id}
                readOnly={readOnly}
                // The inner component will call onSaveTemplate if normal, or onFork if readOnly (conceptually)
                // Let's pass the actual handler down.
            />
        </ReactFlowProvider>
    );
}