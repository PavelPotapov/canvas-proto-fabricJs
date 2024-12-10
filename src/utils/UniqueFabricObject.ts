import { FabricObject } from 'fabric';

const originalToObject = FabricObject.prototype.toObject;

FabricObject.prototype.toObject = function (additionalProperties: string[] = []) {
  return {
    ...originalToObject.call(this, additionalProperties),
    id: this.id,
    name: this.name,
    contextMenu: this.contextMenu,
    menuType: this.menuType,
  };
};
