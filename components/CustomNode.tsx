import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NODE_COLORS, NodeType } from '../types';
import { GripHorizontal, BookOpen } from 'lucide-react';

const CustomNode = ({ data, selected }: NodeProps<NodeData>) => {
  const safeData = data || { label: 'Error', type: NodeType.BEGINNER, description: 'Missing data', emoji: '⚠️', resources: [] };
  const bgColor = NODE_COLORS[safeData.type] || NODE_COLORS[NodeType.BEGINNER];
  const resourceCount = safeData.resources?.length || 0;
  
  return (
    <div 
      className={`
        relative min-w-[220px] max-w-[320px]
        border-2 border-black 
        ${bgColor}
        transition-all duration-200
        ${selected ? 'shadow-neo-xl translate-x-[-4px] translate-y-[-4px]' : 'shadow-neo'}
      `}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !-top-2 !bg-white border-2 !border-black z-50 rounded-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-black bg-white/30">
        <div className="flex items-center gap-2">
            <span className="text-xl">{safeData.emoji || '📌'}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 bg-black text-white px-1 py-0.5">
                {safeData.type}
            </span>
        </div>
        <GripHorizontal className="w-4 h-4 opacity-50 cursor-grab active:cursor-grabbing" />
      </div>

      {/* Content */}
      <div className="p-4 bg-white/10">
        <div className="font-bold text-lg leading-tight mb-2 break-words text-black">
            {safeData.label || 'Untitled Node'}
        </div>
        {safeData.description && (
          <div className="text-sm font-medium text-gray-800 leading-snug break-words">
            {safeData.description}
          </div>
        )}
      </div>

      {/* Resources Trigger - nodrag class ensures it doesn't drag the node */}
      <div className="absolute -bottom-3 right-2 z-40">
        <button 
            className="resource-trigger-button nodrag flex items-center gap-1 bg-neo-cyan text-white border-2 border-black px-2 py-1 shadow-neo hover:scale-105 transition-transform active:translate-y-1 active:shadow-none text-xs font-bold"
            title="Open Resources"
        >
            <BookOpen size={12} />
            {resourceCount > 0 && <span>{resourceCount}</span>}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !-bottom-2 !bg-black border-2 !border-white z-50 rounded-none" />
    </div>
  );
};

export default memo(CustomNode);