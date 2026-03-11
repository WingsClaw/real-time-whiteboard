'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { initializeCanvas, setTool, clearCanvas, exportToImage } from '@/lib/canvas';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'shape' | 'text' | 'sticky'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [boardName, setBoardName] = useState('Untitled Board');

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.width = containerRef.current.clientWidth;
    canvasElement.height = containerRef.current.clientHeight;
    containerRef.current.appendChild(canvasElement);

    const canvas = initializeCanvas(canvasElement);
    canvasRef.current = canvas;

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        canvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Set up real-time subscription
    const subscription = supabase
      .channel('board_elements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_elements',
        },
        (payload) => {
          console.log('Change received!', payload);
          // Handle real-time updates here
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
      canvas.dispose();
      if (containerRef.current && canvasElement) {
        containerRef.current.removeChild(canvasElement);
      }
    };
  }, []);

  const handleToolChange = (tool: typeof currentTool) => {
    setCurrentTool(tool);
    if (canvasRef.current) {
      setTool(canvasRef.current, tool, { color, size: brushSize });
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      clearCanvas(canvasRef.current);
    }
  };

  const handleExport = () => {
    if (canvasRef.current) {
      const dataUrl = exportToImage(canvasRef.current);
      const link = document.createElement('a');
      link.download = `${boardName}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleSave = async () => {
    // Save board elements to Supabase
    // This is a placeholder - actual implementation would sync canvas data
    console.log('Saving board...');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/boards" className="text-lg font-semibold text-gray-700 hover:text-gray-900">
            ←
          </Link>
          <h1 className="text-xl font-semibold">Whiteboard</h1>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <aside className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => handleToolChange('pen')}
            className={`p-2 rounded ${currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Pen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19 7-7 3 3-7 7-3-3z"/>
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="m2 2 7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
          </button>

          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Eraser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
              <path d="M22 21H7"/>
              <path d="m5 11 9 9"/>
            </svg>
          </button>

          <div className="w-10 h-px bg-gray-300 my-2"/>

          <button
            onClick={() => handleToolChange('shape')}
            className={`p-2 rounded ${currentTool === 'shape' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Shape"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            </svg>
          </button>

          <button
            onClick={() => handleToolChange('text')}
            className={`p-2 rounded ${currentTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"/>
              <line x1="9" x2="15" y1="20" y2="20"/>
              <line x1="12" x2="12" y1="4" y2="20"/>
            </svg>
          </button>

          <button
            onClick={() => handleToolChange('sticky')}
            className={`p-2 rounded ${currentTool === 'sticky' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="Sticky Note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
              <path d="M15 3v6h6"/>
            </svg>
          </button>

          <div className="w-10 h-px bg-gray-300 my-2"/>

          <button
            onClick={handleClearCanvas}
            className="p-2 rounded hover:bg-gray-200 text-red-500"
            title="Clear"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 relative">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Right Panel */}
        <aside className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brush Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Collaborators</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  Y
                </div>
                <span>You (Owner)</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
