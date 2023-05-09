import React, { type MouseEvent, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ContainerVariant,
  MemberVariant,
  TitleVariant,
} from "@/utils/variants";
import LexicalRenderer from "./Lexical/LexicalRenderer";
import LexicalTextbox from "./Lexical/LexicalTextbox";

import type { TFaurm } from "@/pages/create";
export type TQuestion = TFaurm["questions"][0];

const MemberProperties = {
  variants: MemberVariant,
  initial: "close",
  exit: "close",
  animate: "open",
};

export function Answer({
  id,
  faurmId,
  title,
  type,
  fields,
  index,
  open,
  onClick,
  handleUpdate,
  value,
}: TQuestion & {
  index: number;
  open?: boolean;
  onClick?: (e?: MouseEvent) => void;
  handleUpdate?: (id: string, value: string) => void;
  value: string;
}) {
  const valueRef = useRef(value);
  const [valueState, setValueState] = useState(value);

  return (
    <motion.div
      tabIndex={0}
      aria-label={`Question ${index + 1}`}
      className="relative flex flex-col items-center justify-center gap-2 outline-none overflow-clip bg-neutral-900 focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
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
      onBlur={() => {
        if (!handleUpdate) return;
        if (type !== "Text") {
          handleUpdate(id, valueState);
        } else {
          handleUpdate(id, valueRef.current);
        }
      }}
      onClick={onClick}
    >
      <motion.h2
        className="absolute p-4 text-2xl select-none"
        variants={TitleVariant}
      >
        {index + 1}
      </motion.h2>
      <div className="w-full min-w-[288px] h-14"></div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              {...MemberProperties}
              custom={0}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col w-full gap-2 px-4"
            >
              Question:
              <LexicalRenderer
                id={id}
                title={title}
                placeholder={"Enter Question Here..."}
                className="bg-neutral-900"
              />
            </motion.div>
            <motion.h4
              {...MemberProperties}
              custom={1}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-4"
            >
              {type !== "Text" ? "Options:" : "Answer:"}
            </motion.h4>
            {type !== "Text" ? (
              <motion.ul
                {...MemberProperties}
                custom={2}
                onClick={(e) => e.stopPropagation()}
                // max-h-48 / 44 [184px]
                className={`flex flex-col items-center w-full gap-4 px-4 mb-4 py-1 max-h-52 overflow-y-auto overflow-x-hidden hidden-scroll ${
                  !fields.length && "-my-3"
                }`}
              >
                {fields.map(({ id: fid, value }, idx) => {
                  if (!value.length) return null;

                  return (
                    <motion.li
                      key={fid}
                      {...MemberProperties}
                      custom={2 + idx}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full"
                    >
                      <label className="flex items-center w-full gap-2 p-2 py-1 rounded-sm outline-none bg-neutral-700 focus-within:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600">
                        <input
                          type="radio"
                          name={id}
                          value={fid}
                          checked={fid === valueState}
                          onChange={(e) => {
                            setValueState(e.target.value);
                          }}
                          className="outline-none"
                        />
                        {value}
                      </label>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : (
              <motion.div
                {...MemberProperties}
                custom={2}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 mb-4"
              >
                <LexicalTextbox
                  id={id}
                  editorStateRef={valueRef}
                  placeholder="Enter Answer Here..."
                  minHeight={"6rem"}
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
