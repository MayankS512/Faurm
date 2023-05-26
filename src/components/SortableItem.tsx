import { useSortable } from "@dnd-kit/sortable";

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
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
  };

  return (
    <div
      onKeyDownCapture={(e) => {
        if (isDragging) {
          e.preventDefault();
        }
      }}
      onPointerDownCapture={(e) => {
        if (!isDragging) e.stopPropagation();
      }}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${isDragging ? `opacity-60 z-50` : ""} ${className} `}
      // onFocus={(e) => {
      //   e.currentTarget.scrollIntoView({
      //     behavior: "smooth",
      //   });
      // }}
    >
      {children}
    </div>
  );
};

export default SortableItem;
