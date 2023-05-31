import SortableItem from "@/components/SortableItem";
import FieldDndContainer from "@/components/FieldDndContainer";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect, useRef } from "react";
import LexicalTextbox from "./Lexical/LexicalTextbox";

import type { TFaurm } from "@/pages/create";
export type TQuestion = TFaurm["questions"][0];

export function MobileQuestion({
  id,
  faurmId,
  title: retrievedTitle,
  type: retreivedType,
  fields: retreivedFields,
  index,
  handleDelete = () => {},
  handleUpdate,
}: TQuestion & {
  index: number;
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
        id: crypto.randomUUID(),
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
    <div
      className="relative flex flex-col items-center justify-center grid-cols-2 gap-4 overflow-y-auto outline-none sm:gap-0 sm:grid min-h-fit bg-neutral-800"
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
      <div className="flex flex-col items-center justify-center w-[288px] gap-4">
        <h2 className="p-4 text-2xl select-none">{index + 1}</h2>
        <button
          type="button"
          aria-label="Delete Question"
          onClick={handleDelete}
          onKeyDownCapture={(e) => {
            e.stopPropagation();
          }}
          className="absolute flex items-center justify-center w-6 h-6 rounded-full outline-none top-2 right-2 sm:left-2 bg-neutral-700 focus:bg-red-600 active:bg-red-700 hover:bg-red-600"
        >
          <Cross2Icon width={12} height={12} />
        </button>
        <div onClick={(e) => e.stopPropagation()} className="w-full px-4">
          <LexicalTextbox
            id={id}
            editorStateRef={titleRef}
            placeholder={"Enter Question Here..."}
          />
        </div>
        <label
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 sm:mb-4"
        >
          Type:
          <select
            className="p-1 rounded-sm outline-none dark:bg-neutral-700 dark:text-neutral-200 selection:bg-neutral-600"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="MCQ">MCQ</option>
            <option value="MAQ">MAQ</option>
            <option value="Text">Text</option>
          </select>
        </label>
      </div>
      <div className="flex flex-col items-center justify-center w-[288px] gap-4 sm:py-2">
        {type !== "Text" ? (
          <ul
            onClick={(e) => e.stopPropagation()}
            // max-h-48 / 44 [184px]
            className={`flex flex-col items-center w-full gap-4 px-4 py-1 max-h-48 sm:max-h-36 overflow-y-auto overflow-x-hidden ${
              !fields.length && "-my-3"
            }`}
          >
            <FieldDndContainer fields={fields} setFields={setFields}>
              {fields.map(({ id, value }, idx) => (
                <li
                  key={id}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full"
                >
                  <SortableItem
                    handle
                    id={id}
                    className="flex items-center w-full pr-[6px] overflow-hidden rounded-sm outline-none group dark:bg-neutral-700 dark:text-neutral-200 "
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
                      className="w-full py-1 bg-transparent outline-none selection:bg-neutral-600 placeholder:text-neutral-400"
                    />
                    {/* // ? Prolly needs a Drag tab too */}
                    <button
                      data-no-dnd="true"
                      type="button"
                      onClick={() => handleDeleteField(idx)}
                      className="-mr-10 ml-2 duration-300 rotate-180 rounded-full outline-none focus:transition-none hover:transition-[margin_transform] focus:bg-red-600 hover:bg-red-600 group-hover:mr-0 group-focus-within:mr-0 group-focus-within:rotate-0 group-hover:rotate-0"
                    >
                      <Cross2Icon className="w-5 h-5 p-1" />
                    </button>
                  </SortableItem>
                </li>
              ))}
            </FieldDndContainer>
          </ul>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full px-4 mb-3"
          >
            <textarea
              className="w-full p-2 rounded-sm resize-none sm:h-full bg-neutral-900 placeholder:text-neutral-400 placeholder:opacity-70 hover:cursor-not-allowed"
              rows={4}
              disabled
              placeholder="Answer Field"
            ></textarea>
          </div>
        )}
        {type !== "Text" && (
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDownCapture={(e) => e.stopPropagation()}
            className="px-4 mb-4"
          >
            <button
              type="button"
              className="p-2 rounded-full outline-none dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:text-neutral-200"
              aria-label="Add Field"
              onClick={(e) => {
                e.stopPropagation();
                handleAddField();
              }}
            >
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
