import { Container, Graphics, Point, Sprite, Texture, FederatedPointerEvent } from 'pixi.js';

interface Tracker {
  container: Container;
  trackerHeight: number;
  framePadding: number;
  isDragging: boolean;
  pixi: any; // Kan typifiseres mer spesifikt basert på din PIXI setup
  cursor: { x: number };
  horizontalRatio: number;
  engine: {
    disableLooping(): void;
    enableLooping(limits: { min: number; max: number }, callback: () => void): void;
  };
}

// Variables to track dragging state
let dragging: boolean = false;
let dragData: any = null; // FederatedPointerEvent data
let dragOffset: Point | null = null;

export default function drag(tracker: Tracker): [Sprite, Sprite, Graphics] {
  const firstCursor = new Sprite(Texture.WHITE);
  firstCursor.width = 2;
  firstCursor.height = tracker.trackerHeight + tracker.framePadding;
  firstCursor.tint = 'red';
  firstCursor.y = 0;
  firstCursor.x = 0;

  const secondCursor = new Sprite(Texture.WHITE);
  secondCursor.width = 2;
  secondCursor.height = tracker.trackerHeight + tracker.framePadding;
  secondCursor.tint = 'red';
  secondCursor.y = 0;
  secondCursor.x = 0;

  const selectedArea = new Graphics()
    .rect(0, 0, 1, tracker.trackerHeight + tracker.framePadding)
    .fill({ alpha: 0.5 });

  // Function to start dragging
  function onDragStart(event: FederatedPointerEvent): void {
    dragging = true;
    dragData = event.data;
    dragOffset = new Point();
    dragData.getLocalPosition(tracker.container, dragOffset);
    firstCursor.x = dragData.global.x;
    selectedArea.x = dragData.global.x;
    tracker.container.addChild(firstCursor);
    tracker.container.addChild(selectedArea);
    tracker.isDragging = false;
  }
  
  // Function to perform dragging
  function onDragMove(): void {
    tracker.isDragging = true;
    if (dragging) {
      tracker.container.alpha = 0.5;
      tracker.container.addChild(secondCursor);
      const newPosition = dragData.getLocalPosition(tracker.container.parent);
      secondCursor.x = newPosition.x;
      
      if (secondCursor.x < firstCursor.x) {
        selectedArea.x = secondCursor.x;
        selectedArea.width = firstCursor.x - secondCursor.x;
      }
      if (secondCursor.x > firstCursor.x) {
        selectedArea.x = firstCursor.x;
        selectedArea.width = secondCursor.x - firstCursor.x;
      }
      tracker.pixi.render();
    }
  }
  
  // Function to stop dragging
  function onDragEnd(): void {
    console.log('dragStopped!');
    dragging = false;
    dragData = null;
    tracker.container.alpha = 1; // Restore the tracker.container's opacity
    
    const startCursorX = Math.min(firstCursor.x, secondCursor.x);
    const endCursorX = Math.max(firstCursor.x, secondCursor.x);
    tracker.cursor.x = startCursorX;
    
    const start = startCursorX / tracker.horizontalRatio + tracker.pixi.screen.height;
    const end = endCursorX / tracker.horizontalRatio + tracker.pixi.screen.height;
    
    console.log(tracker.isDragging);
    if (!tracker.isDragging) {
      tracker.engine.disableLooping();
      tracker.container.removeChild(firstCursor);
      tracker.container.removeChild(secondCursor);
      tracker.container.removeChild(selectedArea);
      tracker.container.alpha = 1;
      return;
    }
    
    const returnFnc = (): void => {
      tracker.cursor.x = startCursorX;
    };
    
    tracker.container.alpha = 0.5;
    tracker.engine.enableLooping({ min: start, max: end }, returnFnc);
  }
  
  // Add the event listeners for dragging
  tracker.container.on('pointerdown', onDragStart);
  tracker.container.on('pointermove', onDragMove);
  tracker.container.on('pointerup', onDragEnd);
  
  return [firstCursor, secondCursor, selectedArea];
}