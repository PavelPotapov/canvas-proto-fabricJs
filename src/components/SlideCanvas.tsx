import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas, Rect } from 'fabric'; // Импортируем Canvas напрямую
import { BoxSize, SlideCanvasHandle } from '../utils/types';
import '../utils/UniqueFabricObject';
import { alignMenu, readOnlyMenu, settingsMenu, specialMenu } from '../config/defaultCfg';

interface SlideCanvasProps {
  canvasId: string;
  onRegister: (canvasId: string, canvas: Canvas, element: HTMLElement) => void;
  onDestroy: (canvasId: string) => void;
}

export const SlideCanvas = forwardRef<SlideCanvasHandle, SlideCanvasProps>(
  ({ canvasId, onRegister, onDestroy }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasInstanceRef = useRef<Canvas | null>(null);

    const addRect = () => {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
        id: '123512',
        name: 'Какое-то имя',
        contextMenu: true,
        menuType: 'align',
      });
      canvasInstanceRef.current?.add(rect);
    };

    //TODO: вынести в отдельный хук
    useEffect(() => {
      if (canvasRef.current) {
        const canvas = new Canvas(canvasRef.current);
        canvasInstanceRef.current = canvas;
        onRegister(canvasId, canvas, canvasRef.current);
        canvasInstanceRef.current.on('mouse:down', (e) => {
          const target = e.target;
          if (target instanceof Rect) {
            if (target.contextMenu) {
              target.on('contextmenu', (e) => {
                e.e.preventDefault();
                if (!target.id || !canvasInstanceRef.current) {
                  return;
                }
                switch (target.menuType) {
                  case 'settings':
                    settingsMenu.show(
                      e.e.clientX,
                      e.e.clientY,
                      target.id,
                      canvasInstanceRef.current,
                    );
                    break;
                  case 'readOnly':
                    readOnlyMenu.show(
                      e.e.clientX,
                      e.e.clientY,
                      target.id,
                      canvasInstanceRef.current,
                    );
                    break;
                  case 'edit':
                    specialMenu.show(
                      e.e.clientX,
                      e.e.clientY,
                      target.id,
                      canvasInstanceRef.current,
                    );
                    break;
                  case 'align':
                    alignMenu.show(e.e.clientX, e.e.clientY, target.id, canvasInstanceRef.current);
                    break;
                  default:
                    break;
                }
              });
            }
          }
        });
        setTimeout(() => {
          addRect();
        }, 1000);
      }
      return () => {
        if (canvasInstanceRef.current) {
          onDestroy(canvasId);
          canvasInstanceRef.current.dispose();
        }
      };
    }, [canvasId, onRegister, onDestroy]);

    useImperativeHandle(ref, () => ({
      renderCanvas: () => {
        canvasInstanceRef.current?.renderAll();
      },
      clearCanvas: () => {
        canvasInstanceRef.current?.clear();
      },
      loadFromJSON: (jsonCfg: string) => {
        canvasInstanceRef.current?.loadFromJSON(jsonCfg, () => {
          canvasInstanceRef.current?.renderAll();
        });
      },
      setCanvasDimensions: ({ width, height }: BoxSize) => {
        canvasInstanceRef.current?.setDimensions({ width, height });
      },
      getCanvasConfig: () => {
        return canvasInstanceRef.current?.toJSON();
      },
    }));

    return (
      <canvas ref={canvasRef} data-canvas-id={canvasId} style={{ width: '100%', height: '100%' }} />
    );
  },
);
