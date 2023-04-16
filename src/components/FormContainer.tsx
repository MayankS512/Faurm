import { MouseEvent, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ContainerVariant,
  MemberVariant,
  TitleVariant,
} from "@/utils/variants";
import SortableItem from "./SortableItem";
import DndContainer from "./DndContainer";
import TextInput from "./TextInput";

interface FormContainerProps {
  id: string;
  title?: string;
  open?: boolean;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  onClick?: (e?: MouseEvent) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  id,
  title = "Z",
  onClick,
  onPointerDown,
  onPointerUp,
  open = false,
}) => {
  const [count, setCount] = useState(97);
  const [items, setItems] = useState<string[]>(["A", "B", "C", "D"]);

  useEffect(() => {
    if (open) return;

    console.log("Save Form Here!");
  }, [open]);

  return (
    <motion.form
      tabIndex={0}
      className="relative flex flex-col items-center justify-center overflow-clip bg-neutral-900 focus-visible:ring-2 ring-neutral-200 focus:outline-none ring-offset-1 ring-offset-transparent"
      variants={ContainerVariant}
      initial={"close"}
      animate={open ? "open" : "close"}
      onAnimationStart={() => {
        window.getSelection()?.removeAllRanges();
      }}
      onAnimationComplete={() => {}}
      onKeyDownCapture={(e) => {
        if (e.currentTarget !== e.target) return;

        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          if (onClick) onClick();
        }
      }}
      onClick={onClick}
    >
      <motion.h2
        className="absolute p-4 text-2xl select-none"
        variants={TitleVariant}
      >
        {title}
      </motion.h2>
      <div className="w-full min-w-[231.3px] h-14"></div>
      <AnimatePresence>
        {open && (
          <DndContainer<string> items={items} setItems={setItems}>
            {items.map((val, idx) => (
              <motion.div
                variants={MemberVariant}
                initial={"close"}
                exit="close"
                animate="open"
                custom={idx + 1}
                key={val}
                className={`mx-4 my-2 ${
                  idx + 1 === items.length ? "mb-4" : ""
                }`}
                onPointerDownCapture={(e) => {
                  e.stopPropagation();
                }}
                onClickCapture={(e) => {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") e.preventDefault();
                }}
              >
                <SortableItem className="rounded-sm" id={val}>
                  <TextInput version={1} />
                </SortableItem>
              </motion.div>
            ))}
          </DndContainer>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default FormContainer;
