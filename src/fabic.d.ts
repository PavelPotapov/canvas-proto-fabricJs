import 'fabric';
import { MenuType } from './utils/types';

declare module 'fabric' {
  interface FabricObject {
    id?: string;
    name?: string;
    contextMenu?: boolean; // Флаг для указания, поддерживает ли объект контекстное меню
    menuType: MenuType;
  }

  interface SerializedObjectProps {
    id?: string;
    name?: string;
    contextMenu?: boolean; // Флаг для указания, поддерживает ли объект контекстное меню
    menuType: MenuType;
  }
}
