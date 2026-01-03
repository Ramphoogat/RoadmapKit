# RoadmapKit

A Neo-brutalist interactive learning roadmap builder with drag-and-drop nodes, custom themes, AI-powered generation, and image export. Built with React, TypeScript, and React Flow.

**Simple, clear, developer-friendly.**

## 🚀 Features

*   **Interactive Canvas:** Drag-and-drop node-based editor using React Flow.
*   **Neo-Brutalism Design:** Bold borders, high contrast, and vibrant colors.
*   **AI Import:** Generate roadmaps from URLs or topics using Google Gemini API.
*   **Resource Management:** Add articles, videos, and courses to specific nodes.
*   **Templates & Showcase:** Save, export, and browse community roadmaps.
*   **Export:** Download roadmaps as high-quality PNG images.

## 🛠️ How to Run Locally

This project is a React application using TypeScript.

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation Steps

1.  **Clone the repository** (or download the source files).

2.  **Install Dependencies**
    If you are setting this up as a new Vite project:
    ```bash
    npm create vite@latest roadmap-kit -- --template react-ts
    cd roadmap-kit
    npm install reactflow framer-motion lucide-react html2canvas @google/genai react-router-dom
    # Copy the provided source files into the src/ folder
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory to enable AI features:
    ```env
    VITE_API_KEY=your_google_gemini_api_key_here
    # Note: In the provided code, it uses process.env.API_KEY. 
    # If using Vite, update code to import.meta.env.VITE_API_KEY or configure define.
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```text
/
├── index.html                  # Entry HTML with Import Maps & Tailwind CDN
├── index.tsx                   # Application Entry Point
├── App.tsx                     # Main Router & Application Logic
├── types.ts                    # TypeScript Interfaces & Constants
├── metadata.json               # Project Metadata
├── README.md                   # Documentation
└── components/                 # UI Components
    ├── Landing.tsx             # Landing Page with AI Import
    ├── RoadmapBuilder.tsx      # Core Canvas & Drag-n-Drop Logic
    ├── CustomNode.tsx          # Custom Node Component (Visuals)
    ├── ResourceModal.tsx       # Modal for Managing Node Resources
    ├── NeoComponents.tsx       # Reusable UI (Buttons, Modals, Cards)
    ├── TemplatesPage.tsx       # Template Library Management
    ├── ShowcasePage.tsx        # Public Community Roadmap Gallery
    ├── PricingPage.tsx         # Pricing Plans & FAQ
    └── AboutPage.tsx           # Company Info & Tech Stack
```

## 🎨 Design System

The application uses a specific color palette defined in `index.html` (via Tailwind config):

*   **Primary:** Neo-Pink (`#FF5252`)
*   **Secondary:** Neo-Cyan (`#448AFF`)
*   **Accents:** Neo-Yellow (`#FFD740`), Neo-Lime (`#69F0AE`)
*   **Background:** Neo-Offwhite (`#FDF6E3`)
*   **Shadows:** Hard, non-blurred shadows (`4px 4px 0px 0px #000`)

## 🤖 Tech Stack

*   **Frontend:** React 18, TypeScript
*   **Styling:** Tailwind CSS (configured for Neo-brutalism)
*   **Canvas Engine:** React Flow
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **AI:** Google Gemini API (@google/genai)
