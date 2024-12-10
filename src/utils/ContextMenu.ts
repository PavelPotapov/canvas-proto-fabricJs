import { Canvas } from 'fabric';

export class ContextMenu {
  private menuElement: HTMLElement;
  private currentCanvas: Canvas | null;
  private stayOpen: boolean = false;

  constructor(
    menuItems: {
      label: string;
      action: (id: string, canvas: Canvas) => void;
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
        const targetId = this.menuElement.dataset.targetId || '';
        if (!this.currentCanvas) return;
        item.action(targetId, this.currentCanvas);
        if (item.closeOnClick !== false) {
          this.hide();
        }
      });
      ul.appendChild(li);
    });

    this.menuElement.appendChild(ul);
    document.body.appendChild(this.menuElement);

    // Добавляем обработчик для клика вне меню
    document.addEventListener('mousedown', this.handleClickOutside.bind(this));
  }

  show(x: number, y: number, targetId: string, canvas: Canvas) {
    if (targetId === '') return;
    this.menuElement.style.display = 'block';
    this.menuElement.style.left = `${x}px`;
    this.menuElement.style.top = `${y}px`;
    this.menuElement.dataset.targetId = targetId;
    this.currentCanvas = canvas;
  }

  hide() {
    this.menuElement.style.display = 'none';
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    this.currentCanvas = null;
  }

  private handleClickOutside(event: MouseEvent) {
    if (
      this.menuElement.style.display === 'block' &&
      !this.menuElement.contains(event.target as Node)
    ) {
      this.hide();
    }
  }
}
