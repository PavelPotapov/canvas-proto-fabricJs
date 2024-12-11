import { ContextMenu } from '../utils/ContextMenu';

const initialShapes = {
  objects: [
    {
      type: 'rect',
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      fill: 'blue',
      id: '123',
      name: 'Какой-то квадрат',
      contextMenu: true,
      menuType: 'rectangle',
    },
    {
      type: 'circle',
      left: 100,
      top: 150,
      radius: 30,
      fill: 'red',
      id: '1235',
      name: 'Какой-то квадрат',
      contextMenu: true,
      menuType: 'circle',
    },
    {
      type: 'text',
      left: 150,
      top: 100,
      text: 'Hello, Fabric!',
      fontSize: 20,
      fill: 'green',
      id: '1234',
      name: 'Какой-то квадрат',
    },
  ],
};

const menus = {
  rectangle: new ContextMenu([
    {
      label: 'Настройка 1',
      action: (id, canvas) => {
        console.log(`Настройка 1 для ID: ${id} в канвасе ${canvas}`);
      },
    },
    {
      label: 'Удалить',
      action: (id, canvas) => {
        const obj = canvas.getObjects().find((o) => o.id === id);
        if (obj) {
          canvas.remove(obj);
          canvas.renderAll();
        }
      },
    },
  ]),
  circle: new ContextMenu([
    {
      label: 'Изменить цвет',
      action: (id, canvas) => {
        const obj = canvas.getObjects().find((o) => o.id === id);
        if (obj) {
          obj.set('fill', 'blue'); // пример изменения цвета
          canvas.renderAll();
        }
      },
      closeOnClick: false,
    },
  ]),
  group: new ContextMenu([
    {
      label: 'Групповые действия',
      action: (ids, canvas) => {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }
        ids.forEach((id) => {
          console.log(`Групповое действие для ID: ${id} для канваса ${canvas}`);
        });
      },
    },
    {
      label: 'Удалить выбранные',
      action: (ids, canvas) => {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }
        ids.forEach((id) => {
          const obj = canvas.getObjects().find((o) => o.id === id);
          if (obj) {
            canvas.remove(obj);
            canvas.renderAll();
            canvas.discardActiveObject();
          }
        });
      },
      closeOnClick: true,
    },
  ]),
};

export { initialShapes, menus };
