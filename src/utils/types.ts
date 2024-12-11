import { Canvas } from 'fabric';

export interface SlideCanvasHandle {
  renderCanvas?: () => void;
  clearCanvas?: () => void;
  loadFromJSON?: (jsonCfg: string) => void;
  setCanvasDimensions?: ({ width, height }: BoxSize) => void;
  getCanvasConfig?: () => string | null;
  instance: Canvas | null;
}

export interface BoxSize {
  width: number;
  height: number;
}

export type MenuType = 'rectangle' | 'circle' | 'group';
