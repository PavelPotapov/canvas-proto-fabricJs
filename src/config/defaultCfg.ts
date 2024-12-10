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
    },
    {
      type: 'circle',
      left: 100,
      top: 150,
      radius: 30,
      fill: 'red',
      id: '1235',
      name: 'Какой-то квадрат',
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

// Контекстное меню для объектов с настройками
const settingsMenu = new ContextMenu([
  {
    label: 'Настройка 1',
    action: (id, canvas) => {
      console.debug(
        'Я бы ещё здесь хотел кое-что сделать, надо искать этот элемент в рамках канвас контейнера, потому что одинаковые элементы могут быть в разных канваса (я имею в виду id)',
        canvas,
      );
      console.debug(`Выбрана настройка 1 для объекта ID: ${id}`);
    },
  },
  {
    label: 'Настройка 2',
    action: (id, canvas) => {
      console.debug(
        'Я бы ещё здесь хотел кое-что сделать, надо искать этот элемент в рамках канвас контейнера, потому что одинаковые элементы могут быть в разных канваса (я имею в виду id)',
        canvas,
      );
      console.debug(`Выбрана настройка 2 для объекта ID: ${id}`);
    },
  },
]);

// Контекстное меню для объектов, которые нельзя редактировать
const readOnlyMenu = new ContextMenu([
  {
    label: 'Показать информацию',
    action: (id, canvas) => {
      console.debug(
        'Я бы ещё здесь хотел кое-что сделать, надо искать этот элемент в рамках канвас контейнера, потому что одинаковые элементы могут быть в разных канваса (я имею в виду id)',
        canvas,
      );
      console.debug(`Показать информацию для объекта ID: ${id}`);
    },
  },
]);

// Контекстное меню для объектов, имеющих специальные действия
const specialMenu = new ContextMenu([
  {
    label: 'Специальное действие',
    action: (id, canvas) => {
      console.debug(
        'Я бы ещё здесь хотел кое-что сделать, надо искать этот элемент в рамках канвас контейнера, потому что одинаковые элементы могут быть в разных канваса (я имею в виду id)',
        canvas,
      );
      console.debug(`Выполнено специальное действие для объекта ID: ${id}`);
    },
  },
]);

const alignMenu = new ContextMenu([
  {
    label: 'Align Left',
    action: (id, canvas) => {
      const object = canvas.getObjects().find((obj) => obj.id === id);
      if (object) {
        object.set('left', 0);
        canvas.renderAll();
      }
    },
    closeOnClick: false, // Меню останется открытым
  },
  {
    label: 'Delete',
    action: (id, canvas) => {
      const object = canvas.getObjects().find((obj) => obj.id === id);
      if (object) {
        canvas.remove(object);
        canvas.renderAll();
      }
    },
    closeOnClick: true, // Меню закроется после клика
  },
]);

export { initialShapes, settingsMenu, readOnlyMenu, specialMenu, alignMenu };
