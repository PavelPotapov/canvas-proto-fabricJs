import { Canvas } from 'fabric';

export class ContextMenu {
  private menuElement: HTMLElement;
  private currentCanvas: Canvas | null;
  private isMenuOpen: boolean;

  constructor(
    menuItems: {
      label: string;
      action: (targetIds: string | string[], canvas: Canvas) => void;
      closeOnClick?: boolean;
    }[],
  ) {
    this.menuElement = document.createElement('div');
    this.menuElement.style.display = 'none';
    this.menuElement.style.position = 'absolute';
    this.menuElement.style.background = 'white';
    this.menuElement.style.border = '1px solid gray';
    this.menuElement.style.zIndex = '1000';
    this.currentCanvas = null;

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';

    menuItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.label;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        const targetIds = this.menuElement.dataset.targetId
          ? this.menuElement.dataset.targetId.split(',')
          : [];
        if (!this.currentCanvas) return;
        item.action(targetIds.length === 1 ? targetIds[0] : targetIds, this.currentCanvas);
        if (item.closeOnClick !== false) {
          this.hide();
        }
      });
      ul.appendChild(li);
    });

    this.menuElement.appendChild(ul);
    document.body.appendChild(this.menuElement);
    this.isMenuOpen = false;
    this.bindEvents();
  }

  show(
    x: number,
    y: number,
    targetId: string | string[],
    canvas: Canvas,
    triggerEvent: MouseEvent,
  ) {
    if (!targetId) return;
    triggerEvent.stopPropagation(); // !!! Important: Stop event propagation to prevent triggering hide on menu due to mousedown.
    this.menuElement.style.display = 'block';
    this.menuElement.style.left = `${x}px`;
    this.menuElement.style.top = `${y}px`;
    this.menuElement.dataset.targetId = Array.isArray(targetId) ? targetId.join(',') : targetId;
    this.currentCanvas = canvas;
    this.isMenuOpen = true;
  }

  hide() {
    this.menuElement.style.display = 'none';
    this.currentCanvas = null;
    this.isMenuOpen = false;
  }

  private handleClickOutside(event: MouseEvent) {
    if (this.isMenuOpen && !this.menuElement.contains(event.target as Node)) {
      this.hide();
    }
  }

  private bindEvents() {
    document.addEventListener('mousedown', this.handleClickOutside.bind(this));
  }
}
