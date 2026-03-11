import { Canvas } from 'fabric/fabric-impl';
import type { StaticCanvas, FabricObject } from 'fabric/fabric-impl';

// Types for canvas elements
export type CanvasElementType = 'pen' | 'eraser' | 'shape' | 'text' | 'sticky' | 'image';

export interface CanvasElementData {
  type: CanvasElementType;
  data: any;
  createdBy?: string;
  createdAt?: string;
}

// Initialize fabric canvas with default settings
export function initializeCanvas(canvasElement: HTMLCanvasElement): StaticCanvas {
  const canvas = new Canvas(canvasElement, {
    isDrawingMode: true,
    backgroundColor: '#ffffff',
    selection: true,
  });

  // Configure drawing brush
  canvas.freeDrawingBrush = new (window as any).fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = '#000000';
  canvas.freeDrawingBrush.width = 3;

  return canvas;
}

// Set drawing tool
export function setTool(canvas: StaticCanvas, tool: CanvasElementType, options: any = {}) {
  canvas.isDrawingMode = tool === 'pen' || tool === 'eraser';

  if (tool === 'pen') {
    canvas.freeDrawingBrush.color = options.color || '#000000';
    canvas.freeDrawingBrush.width = options.size || 3;
  } else if (tool === 'eraser') {
    canvas.freeDrawingBrush.color = '#ffffff';
    canvas.freeDrawingBrush.width = options.size || 20;
  } else {
    canvas.isDrawingMode = false;
  }
}

// Add shape to canvas
export function addShape(canvas: StaticCanvas, type: 'rect' | 'circle', options: any) {
  let shape: FabricObject;

  if (type === 'rect') {
    shape = new (window as any).fabric.Rect({
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: options.color || '#000000',
      strokeWidth: options.size || 2,
      ...options,
    });
  } else {
    shape = new (window as any).fabric.Circle({
      radius: 50,
      fill: 'transparent',
      stroke: options.color || '#000000',
      strokeWidth: options.size || 2,
      ...options,
    });
  }

  canvas.add(shape);
  canvas.setActiveObject(shape);
  return shape;
}

// Add text to canvas
export function addText(canvas: StaticCanvas, text: string, options: any) {
  const textObj = new (window as any).fabric.IText(text, {
    fontSize: 20,
    fill: options.color || '#000000',
    ...options,
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  return textObj;
}

// Add sticky note to canvas
export function addStickyNote(canvas: StaticCanvas, text: string, options: any) {
  const rect = new (window as any).fabric.Rect({
    width: 200,
    height: 150,
    fill: options.color || '#fff475',
    stroke: '#000000',
    strokeWidth: 1,
  });

  const textObj = new (window as any).fabric.IText(text, {
    fontSize: 14,
    fill: '#000000',
    left: 10,
    top: 10,
    width: 180,
  });

  const group = new (window as any).fabric.Group([rect, textObj], {
    ...options,
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  return group;
}

// Convert canvas element to database format
export function elementToData(element: FabricObject): CanvasElementData {
  const data = element.toJSON();

  if (element instanceof (window as any).fabric.Path) {
    return {
      type: 'pen',
      data: {
        path: data.path,
        stroke: data.stroke,
        strokeWidth: data.strokeWidth,
      },
    };
  }

  return {
    type: 'shape',
    data,
  };
}

// Convert database data to canvas element
export function dataToElement(canvasElementData: CanvasElementData): FabricObject | null {
  const { type, data } = canvasElementData;

  if (type === 'pen') {
    return new (window as any).fabric.Path(data.path, {
      stroke: data.stroke,
      strokeWidth: data.strokeWidth,
      fill: 'transparent',
    });
  }

  if (type === 'shape') {
    return fabric.util.enlivenObjects([data])[0];
  }

  return null;
}

// Clear canvas
export function clearCanvas(canvas: StaticCanvas) {
  canvas.clear();
  canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
}

// Export canvas to image
export function exportToImage(canvas: StaticCanvas, format: 'png' | 'jpeg' = 'png'): string {
  return canvas.toDataURL({
    format,
    quality: 1,
  });
}

// Import image to canvas
export function importImage(canvas: StaticCanvas, dataUrl: string): Promise<FabricObject> {
  return new Promise((resolve, reject) => {
    (window as any).fabric.Image.fromURL(dataUrl, (img: FabricObject) => {
      if (!img) {
        reject(new Error('Failed to load image'));
        return;
      }

      img.scaleToWidth(canvas.width! * 0.8);
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      resolve(img);
    });
  });
}
