import { Canvas } from 'fabric';

export class InstanceManager {
  private instances: Map<string, Canvas> = new Map();
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.1,
    });
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const canvasId = entry.target.getAttribute('data-canvas-id');
      if (!canvasId) return;

      const instance = this.instances.get(canvasId);
      if (entry.isIntersecting) {
        instance?.renderAll(); // Вызываем renderAll напрямую на экземпляре Canvas
      } else {
        instance?.clear(); // Очистка, если не виден
      }
    });
  }

  registerInstance(canvasId: string, canvas: Canvas, element: HTMLElement) {
    if (this.instances.has(canvasId)) {
      throw new Error(`Canvas with ID ${canvasId} already registered.`);
    }
    this.instances.set(canvasId, canvas);
    element.setAttribute('data-canvas-id', canvasId);
    this.observer.observe(element);
  }

  destroyInstance(canvasId: string) {
    const instance = this.instances.get(canvasId);
    if (instance) {
      instance.dispose(); // Освобождение ресурсов
      this.instances.delete(canvasId);

      const element = document.querySelector(`[data-canvas-id="${canvasId}"]`);
      if (element) {
        this.observer.unobserve(element); // Прекращаем наблюдение
      }
    }
  }

  getInstance(canvasId: string): Canvas | undefined {
    return this.instances.get(canvasId);
  }
}
