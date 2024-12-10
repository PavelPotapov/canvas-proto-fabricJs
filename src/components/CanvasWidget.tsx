import React, { useRef } from 'react';
import { SlideCanvas } from './SlideCanvas';
import { InstanceManager } from '../services/InstanceManager';
import { SlideCanvasHandle } from '../utils/types';
import { initialShapes } from '../config/defaultCfg';

const instanceManager = new InstanceManager();

export const CanvasWidget: React.FC = () => {
  const slideRef1 = useRef<SlideCanvasHandle | null>(null);
  const slideRef2 = useRef<SlideCanvasHandle | null>(null);

  const handleRenderShapes = () => {
    slideRef1.current?.loadFromJSON(JSON.stringify(initialShapes));
  };

  const getCanvasConfig = () => {
    console.log(slideRef1.current?.getCanvasConfig());
  };

  return (
    <div>
      lf
      <SlideCanvas
        canvasId="slide-1"
        ref={slideRef1}
        onRegister={(id, instance, element) => {
          slideRef1.current?.setCanvasDimensions({ width: 1500, height: 500 });
          instanceManager.registerInstance(id, instance, element);
          handleRenderShapes();
        }}
        onDestroy={(id) => instanceManager.destroyInstance(id)}
      />
      {/* <SlideCanvas
        canvasId="slide-2"
        ref={slideRef2}
        onRegister={(id, adapter, element) => {
          slideRef2.current?.setCanvasDimensions({ width: 1500, height: 500 });
          instanceManager.registerInstance(id, adapter, element);
          handleRenderShapes();
        }}
        onDestroy={(id) => instanceManager.destroyInstance(id)}
      /> */}
      <div style={{ position: 'fixed', right: 0, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => slideRef1.current?.renderCanvas()}>Render Slide 1</button>
        <button onClick={() => slideRef1.current?.clearCanvas()}>Clear Slide 1</button>
        <button onClick={getCanvasConfig}>Get Config</button>
        <button onClick={() => slideRef2.current?.clearCanvas()}>Clear Slide 2</button>
      </div>
    </div>
  );
};
