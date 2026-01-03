import { Edge, Node } from "reactflow";

export enum NodeType {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  FRAMEWORK = 'framework',
  OPTIONAL = 'optional',
  CUSTOM = 'custom'
}

export type ResourceType = 'Article' | 'Video' | 'Course' | 'OpenSource' | 'Feed' | 'Custom';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  description?: string;
  isPremium: boolean;
  discount?: string;
}

export interface NodeData {
  label: string;
  description?: string;
  type: NodeType;
  emoji?: string;
  resources?: Resource[];
}

export interface RoadmapTemplate {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export interface SavedTemplate extends RoadmapTemplate {
  id: string;
  title: string;
  source: 'official' | 'custom' | 'imported';
  sourceUrl?: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  // Public Showcase Fields
  isPublic?: boolean;
  author?: string;
  description?: string;
  tags?: string[];
  likes?: number;
  views?: number;
}

export const NODE_COLORS = {
  [NodeType.BEGINNER]: 'bg-neo-lime',
  [NodeType.INTERMEDIATE]: 'bg-neo-yellow',
  [NodeType.ADVANCED]: 'bg-neo-orange',
  [NodeType.FRAMEWORK]: 'bg-neo-purple text-white',
  [NodeType.OPTIONAL]: 'bg-neo-cyan',
  [NodeType.CUSTOM]: 'bg-neo-pink text-white',
};

export const DEFAULT_NODES = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 100 },
    data: { label: 'Start Here', description: 'Welcome to your roadmap', type: NodeType.BEGINNER, emoji: '🚀', resources: [] },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 250, y: 300 },
    data: { label: 'Learn Basics', description: 'Understand the core concepts', type: NodeType.INTERMEDIATE, emoji: '📚', resources: [] },
  },
];

export const DEFAULT_EDGES = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
];

export const OFFICIAL_TEMPLATES: SavedTemplate[] = [
  {
    id: 'official-react',
    title: 'React.js Roadmap',
    source: 'official',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublic: true,
    author: 'RoadmapKit Team',
    likes: 1205,
    views: 5000,
    tags: ['Frontend', 'React', 'JavaScript'],
    nodes: [
        { id: '1', type: 'customNode', position: { x: 250, y: 50 }, data: { label: 'HTML/CSS', type: NodeType.BEGINNER, emoji: '🎨' } },
        { id: '2', type: 'customNode', position: { x: 250, y: 200 }, data: { label: 'JavaScript', type: NodeType.BEGINNER, emoji: '📜' } },
        { id: '3', type: 'customNode', position: { x: 250, y: 350 }, data: { label: 'React Basics', type: NodeType.INTERMEDIATE, emoji: '⚛️' } },
        { id: '4', type: 'customNode', position: { x: 100, y: 500 }, data: { label: 'State Managers', type: NodeType.ADVANCED, emoji: '📦' } },
        { id: '5', type: 'customNode', position: { x: 400, y: 500 }, data: { label: 'Next.js', type: NodeType.FRAMEWORK, emoji: '▲' } },
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        { id: 'e3-4', source: '3', target: '4', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        { id: 'e3-5', source: '3', target: '5', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
    ]
  },
  {
    id: 'official-python',
    title: 'Python Developer',
    source: 'official',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublic: true,
    author: 'RoadmapKit Team',
    likes: 890,
    views: 3400,
    tags: ['Backend', 'Python', 'Data Science'],
    nodes: [
        { id: '1', type: 'customNode', position: { x: 250, y: 50 }, data: { label: 'Syntax Basics', type: NodeType.BEGINNER, emoji: '🐍' } },
        { id: '2', type: 'customNode', position: { x: 250, y: 200 }, data: { label: 'Data Structures', type: NodeType.INTERMEDIATE, emoji: '📊' } },
        { id: '3', type: 'customNode', position: { x: 250, y: 350 }, data: { label: 'Django / Flask', type: NodeType.FRAMEWORK, emoji: '🌐' } },
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
    ]
  }
];

export const MOCK_PUBLIC_TEMPLATES: SavedTemplate[] = [
    {
        id: 'public-devops',
        title: 'DevOps Essentials 2024',
        source: 'custom',
        createdAt: Date.now() - 100000000,
        updatedAt: Date.now() - 500000,
        isPublic: true,
        author: 'cloud_ninja',
        likes: 342,
        views: 1200,
        tags: ['DevOps', 'Cloud', 'CI/CD'],
        nodes: [
            { id: '1', type: 'customNode', position: { x: 250, y: 50 }, data: { label: 'Linux', type: NodeType.BEGINNER, emoji: '🐧' } },
            { id: '2', type: 'customNode', position: { x: 250, y: 200 }, data: { label: 'Docker', type: NodeType.INTERMEDIATE, emoji: '🐳' } },
            { id: '3', type: 'customNode', position: { x: 250, y: 350 }, data: { label: 'Kubernetes', type: NodeType.ADVANCED, emoji: '☸️' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
            { id: 'e2-3', source: '2', target: '3', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        ]
    },
    {
        id: 'public-uiux',
        title: 'UI/UX Design Path',
        source: 'custom',
        createdAt: Date.now() - 200000000,
        updatedAt: Date.now() - 1000000,
        isPublic: true,
        author: 'design_guru',
        likes: 567,
        views: 2100,
        tags: ['Design', 'Figma', 'UX'],
        nodes: [
            { id: '1', type: 'customNode', position: { x: 250, y: 50 }, data: { label: 'Color Theory', type: NodeType.BEGINNER, emoji: '🎨' } },
            { id: '2', type: 'customNode', position: { x: 250, y: 200 }, data: { label: 'Typography', type: NodeType.BEGINNER, emoji: '🔤' } },
            { id: '3', type: 'customNode', position: { x: 250, y: 350 }, data: { label: 'Figma', type: NodeType.INTERMEDIATE, emoji: '🖌️' } },
        ],
        edges: [
             { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
             { id: 'e2-3', source: '2', target: '3', animated: true, style: { strokeWidth: 3, stroke: '#000' } },
        ]
    }
];