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
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import React, { useState } from "react";
import { CustomMouseSensor, CustomTouchSensor } from "@/utils/sensors";

// ? This will be used in the mobile layout too, if that stays as a separate component having this as a component will be useful, otherwise could be merged with Question component although since this contains a lot of code, may still be better to keep it here.

import type { Field } from "./Question";

interface FieldDndContainerProps {
  children?: React.ReactNode;
  setFields: React.Dispatch<React.SetStateAction<Array<Field>>>;
  fields: Array<Field>;
  Overlay?: React.JSXElementConstructor<{ dragging?: string }>;
}

const FieldDndContainer: React.FC<FieldDndContainerProps> = ({
  children,
  setFields,
  fields,
  Overlay,
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
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (!over) return;

    if (active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);

        return arrayMove(fields, oldIndex, newIndex);
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

  return (
    <DndContext
      sensors={sensors}
      autoScroll={{
        threshold: {
          x: 0,
          y: 0.2,
        },
      }}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToFirstScrollableAncestor, restrictToVerticalAxis]}
    >
      <SortableContext items={fields} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {Overlay && (
        <DragOverlay>
          <Overlay
            dragging={fields.find((field) => field.id === dragging)?.value}
          />
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default FieldDndContainer;
