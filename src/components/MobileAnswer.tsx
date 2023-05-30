import React, { useState, useRef } from "react";
import LexicalRenderer from "./Lexical/LexicalRenderer";
import LexicalTextbox from "./Lexical/LexicalTextbox";

import type { TFaurm } from "@/pages/create";
export type TQuestion = TFaurm["questions"][0];

export function MobileAnswer({
  id,
  title,
  type,
  fields,
  index,
  handleUpdate,
  value,
}: TQuestion & {
  index: number;
  handleUpdate?: (id: string, value: string) => void;
  value: string;
}) {
  const valueRef = useRef(value);
  const [valueState, setValueState] = useState(value);

  return (
    <div
      className="relative flex flex-col items-center justify-center grid-cols-2 gap-4 overflow-y-auto outline-none sm:grid min-h-fit bg-neutral-800"
      onBlur={() => {
        if (!handleUpdate) return;
        if (type !== "Text") {
          handleUpdate(id, valueState);
        } else {
          handleUpdate(id, valueRef.current);
        }
      }}
    >
      <div className="flex flex-col items-center justify-center w-full min-w-[288px] gap-4">
        <h2 className="absolute p-4 text-2xl select-none">{index + 1}</h2>
        <div className="w-full min-w-[288px] h-14"></div>
        <div
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
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-4 sm:py-2 min-w-[288px]">
        <p onClick={(e) => e.stopPropagation()} className="w-full px-4">
          {type !== "Text" ? "Options:" : "Answer:"}
        </p>
        {type !== "Text" ? (
          <ul
            onClick={(e) => e.stopPropagation()}
            // max-h-48 / 44 [184px]
            className={`flex flex-col items-center w-full gap-4 px-4 py-1 max-h-48 sm:max-h-36 overflow-y-auto overflow-x-hidden ${
              !fields.length && "-my-3"
            }`}
          >
            {fields.map(({ id: fid, value }) => {
              if (!value.length) return null;

              return (
                <li
                  key={fid}
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
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full px-4 mb-4"
          >
            <LexicalTextbox
              id={id}
              editorStateRef={valueRef}
              placeholder="Enter Answer Here..."
              minHeight={"6rem"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
