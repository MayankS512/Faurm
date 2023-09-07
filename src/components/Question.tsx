import SortableItem from "@/components/SortableItem";
import FieldDndContainer from "@/components/FieldDndContainer";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import React, { type MouseEvent, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ContainerVariant,
  MemberVariant,
  TitleVariant,
} from "@/utils/variants";
import LexicalRenderer from "./Lexical/LexicalRenderer";
import LexicalTextbox from "./Lexical/LexicalTextbox";

import type { TFaurm } from "@/pages/create";
export type TQuestion = TFaurm["questions"][number];
export type Field = TQuestion["fields"][number];

const MemberProperties = {
  variants: MemberVariant,
  initial: "close",
  exit: "close",
  animate: "open",
};

export function Question({
  id,
  faurmId,
  title: retrievedTitle,
  type: retreivedType,
  fields: retreivedFields,
  index,
  open,
  onClick,
  handleDelete = () => {},
  handleUpdate,
}: TQuestion & {
  index: number;
  open?: boolean;
  onClick?: (e?: MouseEvent) => void;
  handleDelete: () => void;
  handleUpdate: (question: TQuestion) => void;
}) {
  const titleRef = useRef(retrievedTitle);
  const [type, setType] = useState(retreivedType);
  const [fields, setFields] = useState(retreivedFields);

  const added = useRef(false);

  const handleAddField = () => {
    added.current = true;
    setFields((prev) => [
      ...prev,
      {
        id: "Z" + crypto.randomUUID(),
        value: "",
        questionId: id,
      },
    ]);
  };

  const handleDeleteField = (idx: number) => {
    setFields((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  useEffect(() => {
    if (type === "Text") setFields([]);
  }, [type]);

  return (
    <motion.div
      tabIndex={0}
      aria-label={`Question ${index + 1}`}
      className="relative flex flex-col items-center justify-center gap-4 outline-none overflow-clip bg-neutral-900 focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
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
      onBlur={() => {
        if (
          retreivedFields === fields &&
          retrievedTitle === titleRef.current &&
          retreivedType === type
        ) {
          return;
        }

        handleUpdate({
          id,
          type,
          title: titleRef.current,
          fields,
          faurmId,
        });
      }}
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
            <motion.button
              type="button"
              initial={{ right: -250, rotateZ: 360 }}
              exit={{ right: -250, rotateZ: 360 }}
              animate={{ right: 8, rotateZ: 0 }}
              transition={{ duration: 1 }}
              aria-label="Delete Question"
              onClick={handleDelete}
              onKeyDownCapture={(e) => {
                e.stopPropagation();
              }}
              className="absolute flex items-center justify-center w-6 h-6 rounded-full outline-none focus:ring-2 ring-neutral-200 top-2 right-2 bg-neutral-700 focus:bg-red-600 active:bg-red-700 hover:bg-red-600"
            >
              <Cross2Icon width={12} height={12} />
            </motion.button>
            <motion.div
              {...MemberProperties}
              custom={0}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-4"
            >
              {/* <input
                type="text"
                placeholder="Enter Question Here"
                aria-placeholder="Enter Question Here"
                defaultValue={title}
                onBlur={(e) => setTitle(e.target.value)}
                onKeyDownCapture={(e) => e.stopPropagation()}
                className="w-full px-2 py-1 text-xl rounded-sm outline-none dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 placeholder:text-neutral-400 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600"
              /> */}
              <LexicalTextbox
                id={id}
                editorStateRef={titleRef}
                placeholder={"Enter Question Here..."}
              />
            </motion.div>
            <motion.label
              {...MemberProperties}
              custom={1}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2"
            >
              Type:
              <select
                className="p-1 rounded-sm outline-none dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="MCQ">MCQ</option>
                <option value="Text">Text</option>
              </select>
            </motion.label>
            {type !== "Text" ? (
              <motion.ul
                {...MemberProperties}
                custom={2}
                onClick={(e) => e.stopPropagation()}
                // max-h-48 / 44 [184px]
                className={`flex flex-col items-center w-full gap-4 px-4 py-1 max-h-52 overflow-y-auto overflow-x-hidden hidden-scroll ${
                  !fields.length && "-my-3"
                }`}
              >
                <FieldDndContainer
                  fields={fields}
                  setFields={setFields}
                  // Overlay={({ dragging }) => (
                  //   <div className="flex items-center w-full gap-2 p-1 pl-2 pr-[6px] overflow-hidden rounded-sm outline-none group dark:bg-neutral-700 dark:text-neutral-200 ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 absolute">
                  //     <input
                  //       type="text"
                  //       readOnly
                  //       aria-label="Drag Overlay for Field"
                  //       placeholder="Enter Option Here"
                  //       defaultValue={dragging}
                  //       className="w-full bg-transparent outline-none selection:bg-neutral-600 placeholder:text-neutral-400"
                  //     />
                  //     <div className="-mr-10 rotate-180 rounded-full outline-none focus:bg-red-600 active:bg-red-700 hover:bg-red-600 focus:ring-2 ring-neutral-200 ring-offset-neutral-700 group-hover:mr-0 group-focus-within:mr-0 group-focus-within:rotate-0 group-hover:rotate-0">
                  //       <Cross2Icon className="w-5 h-5 p-1" />
                  //     </div>
                  //   </div>
                  // )}
                >
                  {fields.map(({ id, value }, idx) => (
                    <motion.li
                      key={id}
                      {...MemberProperties}
                      custom={added.current ? -1 : 2 + idx}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full"
                    >
                      <SortableItem
                        id={id}
                        className="flex items-center w-full gap-2 pr-[6px] overflow-hidden rounded-sm outline-none group dark:bg-neutral-700 dark:text-neutral-200 focus-within:ring-2 focus:ring-2 focus-within:ring-neutral-200 focus:ring-neutral-600 ring-offset-1 ring-offset-neutral-800"
                      >
                        <input
                          type="text"
                          placeholder="Enter Option Here"
                          aria-placeholder="Enter Option Here"
                          defaultValue={value}
                          onBlur={(e) => {
                            // ? Might be unnecessary due to internal checks but does reduce a 'rerender' log.
                            if (fields[idx].value === e.target.value) return;

                            setFields((prev) => {
                              const fields = prev.slice();
                              fields[idx].value = e.target.value;
                              return fields;
                            });
                          }}
                          onKeyDownCapture={(e) => {
                            e.stopPropagation();
                          }}
                          className="w-full py-1 pl-2 bg-transparent outline-none selection:bg-neutral-600 placeholder:text-neutral-400"
                        />
                        {/* // ? Prolly needs a Drag tab too */}
                        <button
                          data-no-dnd="true"
                          type="button"
                          onClick={() => handleDeleteField(idx)}
                          className="-mr-10 duration-300 rotate-180 rounded-full outline-none focus:transition-none hover:transition-[margin_transform] focus:bg-red-600 hover:bg-red-600 focus:ring-2 ring-neutral-200 ring-offset-neutral-700 group-hover:mr-0 group-focus-within:mr-0 group-focus-within:rotate-0 group-hover:rotate-0"
                        >
                          <Cross2Icon className="w-5 h-5 p-1" />
                        </button>
                      </SortableItem>
                    </motion.li>
                  ))}
                </FieldDndContainer>
              </motion.ul>
            ) : (
              <motion.div
                {...MemberProperties}
                custom={2}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 mb-3"
              >
                <textarea
                  className="w-full p-2 rounded-sm resize-none sm:h-full bg-neutral-900 placeholder:text-neutral-400 placeholder:opacity-70 hover:cursor-not-allowed"
                  rows={4}
                  disabled
                  placeholder="Answer Field"
                ></textarea>
              </motion.div>
            )}
            {type !== "Text" && (
              <motion.div
                {...MemberProperties}
                custom={fields.length + 2}
                onClick={(e) => e.stopPropagation()}
                onKeyDownCapture={(e) => e.stopPropagation()}
                className="px-4 mb-4"
              >
                <button
                  type="button"
                  className="p-2 rounded-full outline-none dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800"
                  aria-label="Add Field"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddField();
                  }}
                >
                  <PlusIcon />
                </button>
              </motion.div>
            )}
            {/* <motion.div
              {...MemberProperties}
              custom={fields.length + 3}
              className="w-full px-4 mb-4"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // handleSave(id);
                  if (handleUpdate)
                    handleUpdate({
                      id,
                      type,
                      title,
                      fields,
                      faurmId,
                    });
                }}
                onKeyDownCapture={(e) => {
                  e.stopPropagation();
                }}
                aria-label="Save Question"
                className="w-full p-2 rounded-sm outline-none dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:active:bg-neutral-950 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800"
              >
                Save
              </button>
            </motion.div> */}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuestionOverlay({
  id,
  title,
  type,
  fields,
  index,
  open,
}: TQuestion & {
  index: number;
  open?: boolean;
}) {
  // ? Need input tags for placeholders.

  return (
    <div
      aria-label={`Question ${index + 1}`}
      className={`relative flex flex-col items-center drop-shadow-lg justify-center gap-4 outline-none overflow-clip bg-neutral-800 ${
        open ? "rounded-md" : "rounded-full h-[100px] w-[100px]"
      }`}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className={`p-4 text-2xl select-none ${open ? "pb-2" : "absolute "}`}>
        {index + 1}
      </h2>

      {open && (
        <>
          <button
            type="button"
            aria-label="Delete Question"
            className="absolute flex items-center justify-center w-6 h-6 rounded-full outline-none focus:ring-2 ring-neutral-200 top-2 right-2 bg-neutral-700 focus:bg-red-600 active:bg-red-700 hover:bg-red-600"
          >
            <Cross2Icon width={12} height={12} />
          </button>
          <div className="w-full px-4">
            {/* <input
              readOnly
              type="text"
              placeholder="Enter Question Here"
              aria-placeholder="Enter Question Here"
              defaultValue={title}
              className="w-full px-2 py-1 text-xl rounded-sm outline-none dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 placeholder:text-neutral-400 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600"
            /> */}
            <LexicalRenderer
              id={id}
              title={title}
              placeholder={"Enter Question Here..."}
              className="bg-neutral-700"
            />
          </div>
          <label className="flex items-center gap-2">
            Type:
            <select
              aria-readonly
              className="p-1 rounded-sm outline-none dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600"
              defaultValue={type}
            >
              <option value="MCQ">MCQ</option>
              <option value="Text">Text</option>
            </select>
          </label>
          {type !== "Text" ? (
            <ul
              // max-h-48 / 44 [184px]
              className={`flex flex-col items-center w-full gap-4 px-4 py-1 max-h-52 overflow-y-auto overflow-x-hidden hidden-scroll ${
                !fields.length && "-my-3"
              }`}
            >
              {fields.map(({ id, value }) => (
                <li key={id} className="w-full">
                  <input
                    readOnly
                    type="text"
                    placeholder="Enter Option Here"
                    aria-placeholder="Enter Option Here"
                    defaultValue={value}
                    className="w-full px-2 py-1 rounded-sm outline-none bg-neutral-700 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 selection:bg-neutral-600 placeholder:text-neutral-400"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full px-4 mb-3">
              <textarea
                className="w-full p-2 rounded-sm resize-none sm:h-full bg-neutral-900 placeholder:text-neutral-400 placeholder:opacity-70 hover:cursor-not-allowed"
                rows={4}
                disabled
                placeholder="Answer Field"
              ></textarea>
            </div>
          )}
          {type !== "Text" && (
            <div className="px-4 mb-4">
              <button
                type="button"
                className="p-2 rounded-full outline-none dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800"
                aria-label="Add Field"
              >
                <PlusIcon />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
