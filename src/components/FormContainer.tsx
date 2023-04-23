import { MouseEvent, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ContainerVariant,
  MemberVariant,
  TitleVariant,
} from "@/utils/variants";
import Textbox from "./LexicalEditor/Textbox";
import Fields from "./Fields";
import Dropdown, { DropdownOption } from "./Dropdown";
import { useFaurmStore } from "@/store/store";

interface FormContainerProps {
  id: number;
  title?: string | number;
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
  const [type, setType] = useState<"MCQ" | "MAQ" | "Text">("MCQ");
  const setQuestion = useFaurmStore((state) => state.setQuestion);

  useEffect(() => {
    if (open) return;

    setQuestion(id, { type, fields: type !== "Text" ? [] : undefined });
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
          <>
            <motion.div
              variants={MemberVariant}
              initial={"close"}
              exit="close"
              animate="open"
              custom={0}
              className="px-4 py-2 w-72"
              onClick={(e) => e.stopPropagation()}
            >
              <Textbox id={id} />
            </motion.div>
            <motion.div
              variants={MemberVariant}
              initial={"close"}
              exit="close"
              animate="open"
              custom={1}
              onClick={(e) => e.stopPropagation()}
              className="p-4"
            >
              <Dropdown
                label="Field Type:"
                name={type}
                value={type}
                length={3}
                onChange={setType}
              >
                <DropdownOption value={"MCQ"}>MCQ</DropdownOption>
                <DropdownOption value={"MAQ"}>MAQ</DropdownOption>
                <DropdownOption value={"Text"}>Text</DropdownOption>
              </Dropdown>
            </motion.div>
            {type !== "Text" ? (
              <Fields id={id} />
            ) : (
              <motion.div
                variants={MemberVariant}
                initial={"close"}
                exit="close"
                animate="open"
                custom={2}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 mt-2 mb-3"
              >
                <textarea
                  className="w-full p-2 rounded-sm resize-none sm:h-full placeholder:text-neutral-400 placeholder:opacity-70 hover:cursor-not-allowed"
                  rows={4}
                  disabled
                  placeholder="Answer Field"
                ></textarea>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default FormContainer;
