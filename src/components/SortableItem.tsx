import { useSortable } from "@dnd-kit/sortable";
import { useEffect } from "react";

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  className,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // TODO: Add disabled property to global state and update it when focused on text editor OR Implement new design to use title circle as dragging tab.

  const style = {
    transition,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
  };

  return (
    <div
      onPointerDownCapture={(e) => {
        if (!isDragging) e.stopPropagation();
      }}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${
        isDragging ? "opacity-60 z-50" : ""
      } ${className} focus:outline-none focus-visible:ring-2 ring-offset-1 ring-neutral-400 ring-opacity-60 ring-offset-transparent`}
    >
      {children}
    </div>
  );
};

export default SortableItem;
