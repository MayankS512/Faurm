import {
  type DragEndEvent,
  DndContext,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  type SortingStrategy,
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {} from "@dnd-kit/modifiers";
import React, { useState } from "react";
import { CustomMouseSensor, CustomTouchSensor } from "@/utils/sensors";

// Pass in a single function or 2 functions in an array or object.
type KeyboardEvents =
  | { (): void }
  // | [start: { (): void }, end: { (): void }]
  | {
      start?: { (): void };
      end?: { (): void };
    };

interface DndContainerProps<T> {
  children?: React.ReactNode;
  setItems: React.Dispatch<React.SetStateAction<Array<T>>>;
  items: Array<T>;
  setDrag?: React.Dispatch<React.SetStateAction<UniqueIdentifier | undefined>>;
  orientation?: "horizontal" | "vertical" | "grid";
  Overlay?: React.JSXElementConstructor<{ children?: React.ReactNode }>;
  keyboardEvents?: KeyboardEvents;
}

function DndContainer<T>({
  children,
  setItems,
  items,
  setDrag,
  orientation = "vertical",
  Overlay,
  keyboardEvents,
}: DndContainerProps<T>): React.ReactElement {
  const [dragging, setDragging] = useState<UniqueIdentifier>();

  const sensors = useSensors(
    useSensor(CustomMouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(CustomTouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      onActivation() {
        if (keyboardEvents) {
          if (typeof keyboardEvents === "function") {
            keyboardEvents();
          } else {
            keyboardEvents.start && keyboardEvents.start();
          }
        }
      },
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active, activatorEvent } = e;
    if (activatorEvent.type === "keydown") {
      if (keyboardEvents) {
        if (typeof keyboardEvents === "function") {
          keyboardEvents();
        } else {
          keyboardEvents.end && keyboardEvents.end();
        }
      }
    }

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as T);
        const newIndex = items.indexOf(over.id as T);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    if (!Overlay) return;
    setDragging(undefined);
    if (setDrag) setDrag(undefined);
  };

  const handleDragStart = (e: DragStartEvent) => {
    if (!Overlay) return;

    const { active } = e;
    setDragging(active.id);
    if (setDrag) setDrag(active.id);
  };

  const currentStrategy: () => SortingStrategy = () => {
    switch (orientation) {
      case "grid":
        return rectSortingStrategy;
      case "horizontal":
        return horizontalListSortingStrategy;
      case "vertical":
        return verticalListSortingStrategy;
      default:
        return verticalListSortingStrategy;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      autoScroll
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={items as UniqueIdentifier[]}
        strategy={currentStrategy()}
      >
        {children}
      </SortableContext>
      {Overlay && (
        <DragOverlay>
          <Overlay>{dragging}</Overlay>
        </DragOverlay>
      )}
    </DndContext>
  );
}

export default DndContainer;
