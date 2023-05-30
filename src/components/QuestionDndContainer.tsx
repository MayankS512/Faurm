import {
  type DragEndEvent,
  DndContext,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
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
import React, { useState } from "react";
import { CustomMouseSensor, CustomTouchSensor } from "@/utils/sensors";
import { TRPCOutputs } from "@/utils/trpc";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

// ? This will be used in the mobile layout too, if that stays as a separate component having this as a component will be useful, otherwise could be merged with Question component although since this contains a lot of code, may still be better to keep it here.

// Pass in a single function or 2 functions in an array or object.
type KeyboardEvents =
  | { (): void }
  // | [start: { (): void }, end: { (): void }]
  | {
      start?: { (): void };
      end?: { (): void };
    };

type Faurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;
type Question = Faurm["questions"][0];

interface QuestionDndContainerProps {
  children?: React.ReactNode;
  setQuestions: React.Dispatch<React.SetStateAction<Array<Question>>>;
  questions: Array<Question>;
  orientation?: "horizontal" | "vertical" | "grid";
  Overlay?: React.JSXElementConstructor<{ dragging: number }>;
  keyboardEvents?: KeyboardEvents;
}

const QuestionDndContainer: React.FC<QuestionDndContainerProps> = ({
  children,
  setQuestions,
  questions,
  orientation = "horizontal",
  Overlay,
  keyboardEvents,
}) => {
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
      setQuestions((questions) => {
        const oldIndex = questions.findIndex((field) => field.id === active.id);
        const newIndex = questions.findIndex((field) => field.id === over.id);

        return arrayMove(questions, oldIndex, newIndex);
      });
    }

    if (!Overlay) return;
    setDragging(undefined);
  };

  const handleDragStart = (e: DragStartEvent) => {
    if (!Overlay) return;

    const { active } = e;
    setDragging(active.id);
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
      modifiers={
        orientation === "vertical"
          ? [restrictToVerticalAxis, restrictToParentElement]
          : [
              // restrictToHorizontalAxis,
              // restrictToFirstScrollableAncestor,
              // restrictToParentElement,
            ]
      }
    >
      <SortableContext items={questions} strategy={currentStrategy()}>
        {children}
      </SortableContext>
      {Overlay && (
        <DragOverlay>
          <Overlay
            dragging={questions.findIndex((val) => val.id === dragging)}
          />
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default QuestionDndContainer;
