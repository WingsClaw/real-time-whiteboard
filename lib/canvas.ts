import { Canvas, Rect, Circle, IText, Group, Path } from 'fabric/fabric-impl';
import { PencilBrush } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

// Types for canvas elements
export type CanvasElementType = 'pen' | 'eraser' | 'shape' | 'text' | 'sticky' | 'image';

export interface CanvasElementData {
  type: CanvasElementType;
  data: any;
  createdBy?: string;
  createdAt?: string;
}

// Initialize fabric canvas with default settings
export function initializeCanvas(canvasElement: HTMLCanvasElement): Canvas {
  const canvas = new Canvas(canvasElement, {
    isDrawingMode: true,
    backgroundColor: '#ffffff',
    selection: true,
  });

  // Configure drawing brush
  const brush = new PencilBrush(canvas);
  brush.color = '#000000';
  brush.width = 3;
  (canvas as any).freeDrawingBrush = brush;

  return canvas;
}

// Set drawing tool
export function setTool(canvas: Canvas, tool: CanvasElementType, options: any = {}) {
  canvas.isDrawingMode = tool === 'pen' || tool === 'eraser';

  const brush = (canvas as any).freeDrawingBrush;
  if (brush) {
    if (tool === 'pen') {
      brush.color = options.color || '#000000';
      brush.width = options.size || 3;
    } else if (tool === 'eraser') {
      brush.color = '#ffffff';
      brush.width = options.size || 20;
    }
  }
}

// Add shape to canvas
export function addShape(canvas: Canvas, type: 'rect' | 'circle', options: any) {
  let shape: Rect | Circle;

  if (type === 'rect') {
    shape = new Rect({
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: options.color || '#000000',
      strokeWidth: options.size || 2,
      ...options,
    });
  } else {
    shape = new Circle({
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
export function addText(canvas: Canvas, text: string, options: any) {
  const textObj = new IText(text, {
    fontSize: 20,
    fill: options.color || '#000000',
    ...options,
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  return textObj;
}

// Add sticky note to canvas
export function addStickyNote(canvas: Canvas, text: string, options: any) {
  const rect = new Rect({
    width: 200,
    height: 150,
    fill: options.color || '#fff475',
    stroke: '#000000',
    strokeWidth: 1,
  });

  const textObj = new IText(text, {
    fontSize: 14,
    fill: '#000000',
    left: 10,
    top: 10,
    width: 180,
  });

  const group = new Group([rect, textObj], {
    ...options,
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  return group;
}

// Convert canvas element to database format
export function elementToData(element: any): CanvasElementData {
  const data = element.toJSON();

  if (element instanceof Path) {
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
export function dataToElement(canvasElementData: CanvasElementData): any {
  const { type, data } = canvasElementData;

  if (type === 'pen') {
    return new Path(data.path, {
      stroke: data.stroke,
      strokeWidth: data.strokeWidth,
      fill: 'transparent',
    });
  }

  if (type === 'shape') {
    return (fabric.util as any).enlivenObjects([data])[0];
  }

  return null;
}

// Clear canvas
export function clearCanvas(canvas: Canvas) {
  canvas.clear();
  canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
}

// Export canvas to image
export function exportToImage(canvas: Canvas, format: 'png' | 'jpeg' = 'png'): string {
  return canvas.toDataURL({
    format,
    quality: 1,
  });
}

// Import image to canvas
export function importImage(canvas: Canvas, dataUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    (fabric.Image as any).fromURL(dataUrl, (img: any) => {
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
