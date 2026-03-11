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
export function initializeCanvas(canvasElement: HTMLCanvasElement): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasElement, {
    isDrawingMode: true,
    backgroundColor: '#ffffff',
    selection: true,
  });

  // Configure drawing brush
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = '#000000';
  canvas.freeDrawingBrush.width = 3;

  return canvas;
}

// Set drawing tool
export function setTool(canvas: fabric.Canvas, tool: CanvasElementType, options: any = {}) {
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
export function addShape(canvas: fabric.Canvas, type: 'rect' | 'circle', options: any) {
  let shape: fabric.Object;

  if (type === 'rect') {
    shape = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: options.color || '#000000',
      strokeWidth: options.size || 2,
      ...options,
    });
  } else {
    shape = new fabric.Circle({
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
export function addText(canvas: fabric.Canvas, text: string, options: any) {
  const textObj = new fabric.IText(text, {
    fontSize: 20,
    fill: options.color || '#000000',
    ...options,
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  return textObj;
}

// Add sticky note to canvas
export function addStickyNote(canvas: fabric.Canvas, text: string, options: any) {
  const rect = new fabric.Rect({
    width: 200,
    height: 150,
    fill: options.color || '#fff475',
    stroke: '#000000',
    strokeWidth: 1,
  });

  const textObj = new fabric.IText(text, {
    fontSize: 14,
    fill: '#000000',
    left: 10,
    top: 10,
    width: 180,
  });

  const group = new fabric.Group([rect, textObj], {
    ...options,
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  return group;
}

// Convert canvas element to database format
export function elementToData(element: fabric.Object): CanvasElementData {
  const data = element.toJSON();

  if (element instanceof fabric.Path) {
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
export function dataToElement(canvasElementData: CanvasElementData): fabric.Object | null {
  const { type, data } = canvasElementData;

  if (type === 'pen') {
    return new fabric.Path(data.path, {
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
export function clearCanvas(canvas: fabric.Canvas) {
  canvas.clear();
  canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
}

// Export canvas to image
export function exportToImage(canvas: fabric.Canvas, format: 'png' | 'jpeg' = 'png'): string {
  return canvas.toDataURL({
    format,
    quality: 1,
  });
}

// Import image to canvas
export function importImage(canvas: fabric.Canvas, dataUrl: string): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(dataUrl, (img) => {
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
