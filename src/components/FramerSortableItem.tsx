import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";

// ? This is not being used anywhere, but could be useful later

interface FramerSortableItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}

const FramerSortableItem: React.FC<FramerSortableItemProps> = ({
  id,
  children,
  className,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id, transition: null });

  return (
    <motion.div
      onPointerDownCapture={(e) => {
        if (!isDragging) e.stopPropagation();
      }}
      layoutId={String(id)}
      ref={setNodeRef}
      className={`${className} relative`}
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isDragging ? 1.05 : 1,
              zIndex: isDragging ? 50 : 0,
              opacity: isDragging ? 0.6 : 1,
              boxShadow: isDragging
                ? "0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)"
                : undefined,
            }
          : {
              x: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: {
          type: "spring",
        },
        scale: {
          duration: 0.25,
        },
        zIndex: {
          delay: isDragging ? 0 : 0.25,
        },
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </motion.div>
  );
};

export default FramerSortableItem;
