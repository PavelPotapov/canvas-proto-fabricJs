import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from 'fabric';
import { SlideCanvasHandle } from '../utils/types';
import '../utils/UniqueFabricObject';
import { menus } from '../config/defaultCfg';

interface SlideCanvasProps {
  canvasId: string;
  onRegister: (canvasId: string, canvas: Canvas, element: HTMLElement) => void;
  onDestroy: (canvasId: string) => void;
}

export const SlideCanvas = forwardRef<SlideCanvasHandle, SlideCanvasProps>(
  ({ canvasId, onRegister, onDestroy }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasInstanceRef = useRef<Canvas | null>(null);
    const selectors = {
      topCanvas: '[data-fabric="top"]',
    };

    //TODO: вынести в отдельный хук
    useEffect(() => {
      const handleContextMenu = (e: MouseEvent) => {
        // Проверяем, было ли событие внутри канваса
        if (canvasRef.current && e.target) {
          const target = e.target as HTMLElement;
          // Проверяем, находится ли клик внутри верхнего канваса
          if (target.closest(selectors.topCanvas)) {
            e.preventDefault(); // Отменяем стандартное контекстное меню
            console.debug('Custom context menu action triggered');
          }
        }
      };
      if (canvasRef.current) {
        const canvas = new Canvas(canvasRef.current);
        canvasInstanceRef.current = canvas;
        onRegister(canvasId, canvas, canvasRef.current);

        document.addEventListener('contextmenu', handleContextMenu);

        // Обработчик событий для открытия меню при правом клике
        canvas.on('mouse:down:before', (e) => {
          const pointer = canvas.getPointer(e.e);
          const target = e.target;
          const selectedObjects = canvas.getActiveObjects();

          // Проверяем, что событие является MouseEvent и был ли клик правой кнопкой мыши
          if (e.e instanceof MouseEvent && e.e.button === 2) {
            // ПКМ
            e.e.preventDefault(); // Предотвращаем стандартное контекстное меню

            if (selectedObjects.length > 1) {
              // Открываем контекстное меню для группы объектов
              const groupMenu = menus['group'];
              if (groupMenu) {
                groupMenu.show(
                  pointer.x,
                  pointer.y,
                  selectedObjects.map((obj) => obj.id || ''), // Получаем id выбранных объектов
                  canvas,
                  e.e,
                );
              }
            } else if (target && target.contextMenu) {
              // Открываем контекстное меню для одиночного объекта
              const menu = menus[target.menuType];
              if (menu) {
                menu.show(pointer.x, pointer.y, target.id || '', canvas, e.e);
              }
            }
          }
        });
      }

      return () => {
        if (canvasInstanceRef.current) {
          onDestroy(canvasId);
          canvasInstanceRef.current.dispose();
          document.removeEventListener('contextmenu', handleContextMenu);
        }
      };
    }, [canvasId, onRegister, onDestroy]);

    useImperativeHandle(ref, () => ({
      //В будущем здесь можно реализовать методы для работы с канвасом (декораторы над функциями из fabric)
      get instance() {
        return canvasInstanceRef.current;
      },
    }));

    return (
      <canvas ref={canvasRef} data-canvas-id={canvasId} style={{ width: '100%', height: '100%' }} />
    );
  },
);
