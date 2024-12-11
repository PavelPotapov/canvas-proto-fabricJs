import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
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
    const [contextMenuButton, setContextMenuButton] = useState<{ x: number; y: number } | null>(
      null,
    );
    const copiedObjects = useRef<any[]>([]);
    const selectors = {
      topCanvas: '[data-fabric="top"]',
    };

    const copyObjects = async () => {
      const activeObjects = canvasInstanceRef.current?.getActiveObjects();
      if (activeObjects && activeObjects.length > 0) {
        copiedObjects.current = activeObjects.map((obj) => obj.clone());
        copiedObjects.current = await Promise.all(copiedObjects.current);
        console.log('Скопированные объекты:', copiedObjects.current);
      }
    };

    const pasteObjects = () => {
      if (copiedObjects.current.length > 0) {
        const canvas = canvasInstanceRef.current;
        const offsetX = 10; // Смещение для вставленных объектов
        const offsetY = 10;

        copiedObjects.current.forEach((obj) => {
          obj.set({
            left: obj.left + offsetX,
            top: obj.top + offsetY,
            selectable: true, // Убедитесь, что вставленные объекты можно выделять
          });
          canvas?.add(obj);
        });
        canvas?.renderAll();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // Для Mac используем metaKey
        switch (event.key) {
          case 'c':
            copyObjects();
            event.preventDefault(); // Отменяем стандартное поведение
            break;
          case 'v':
            pasteObjects();
            event.preventDefault(); // Отменяем стандартное поведение
            break;
        }
      }
    };

    const openContextMenuForButtonSetting = useCallback(() => {
      if (canvasInstanceRef.current && contextMenuButton) {
        const pointer = {
          x: contextMenuButton.x,
          y: contextMenuButton.y,
        };
        const selectedObjects = canvasInstanceRef.current.getActiveObjects();
        if (selectedObjects.length > 1) {
          const groupMenu = menus['group'];
          if (groupMenu) {
            groupMenu.show(
              pointer.x,
              pointer.y,
              selectedObjects.map((obj) => obj.id || ''),
              canvasInstanceRef.current,
              new MouseEvent('contextmenu'), // имитация события контекстного меню
            );
          }
        } else if (selectedObjects.length === 1) {
          const target = selectedObjects[0];
          const menu = menus[target.menuType];
          if (menu) {
            menu.show(
              pointer.x,
              pointer.y,
              target.id || '',
              canvasInstanceRef.current,
              new MouseEvent('contextmenu'),
            );
          }
        }
      }
    }, [contextMenuButton]);

    useEffect(() => {
      const handleContextMenu = (e: MouseEvent) => {
        if (canvasRef.current && e.target) {
          const target = e.target as HTMLElement;
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

        // Обновляем состояние при изменении выбора объектов
        canvas.on('selection:created', () => {
          updateButtonPosition();
        });
        canvas.on('selection:updated', () => {
          updateButtonPosition();
        });
        canvas.on('selection:cleared', () => {
          setContextMenuButton(null); // Скрыть кнопку при очистке выбора
        });
        // Обработчик для перемещения объектов
        canvas.on('object:moving', updateButtonPosition);
        // Обработчик для поворота объектов
        canvas.on('object:rotating', updateButtonPosition);
        // Обработчик для масштабирования объектов
        canvas.on('object:scaling', updateButtonPosition);
        // Обработчик событий для открытия меню при правом клике
        canvas.on('mouse:down:before', (e) => {
          const pointer = canvas.getPointer(e.e);
          const target = e.target;
          const selectedObjects = canvas.getActiveObjects();
          if (e.e instanceof MouseEvent && e.e.button === 2) {
            if (selectedObjects.length > 1) {
              const groupMenu = menus['group'];
              if (groupMenu) {
                groupMenu.show(
                  pointer.x,
                  pointer.y,
                  selectedObjects.map((obj) => obj.id || ''),
                  canvas,
                  e.e,
                );
              }
            } else if (target && target.contextMenu) {
              const menu = menus[target.menuType];
              if (menu) {
                menu.show(pointer.x, pointer.y, target.id || '', canvas, e.e);
              }
            }
          }
        });
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
      }

      return () => {
        if (canvasInstanceRef.current) {
          onDestroy(canvasId);
          canvasInstanceRef.current.dispose();
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('contextmenu', handleContextMenu);
        }
      };
    }, [canvasId, onRegister, onDestroy]);

    const updateButtonPosition = () => {
      const activeObject = canvasInstanceRef.current?.getActiveObject();

      if (activeObject) {
        // Получаем размеры рамки выделения
        const boundingRect = activeObject.getBoundingRect();

        // Расчет координат для кнопки (верхний правый угол рамки)
        const x = boundingRect.left + boundingRect.width + 1; // Смещение вправо на 10 пикселей
        const y = boundingRect.top + 40; // На уровне верхней границы рамки

        setContextMenuButton({ x, y });
      }
    };

    useImperativeHandle(ref, () => ({
      get instance() {
        return canvasInstanceRef.current;
      },
    }));

    return (
      <>
        <canvas
          ref={canvasRef}
          data-canvas-id={canvasId}
          style={{ width: '100%', height: '100%' }}
        />
        {contextMenuButton && (
          <button
            onClick={openContextMenuForButtonSetting}
            style={{
              position: 'absolute',
              top: `${contextMenuButton.y}px`,
              left: `${contextMenuButton.x}px`,
            }}
          >
            Outline
          </button>
        )}
      </>
    );
  },
);
