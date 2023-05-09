import React, { useState } from "react";
import LexicalTextbox from "./Lexical/LexicalTextbox";

// ? This contians the mobile layout for a faurm, currently not being used anywhere.

const MobileFaurm: React.FC<{
  title?: string | number;
  id: number;
}> = ({ title = "Z", id }) => {
  const [type, setType] = useState<"MCQ" | "MAQ" | "Text">("MCQ");

  return (
    <div
      onBlur={() => {
        console.log("Save form here!");
      }}
      className="flex flex-col items-center w-full grid-cols-2 gap-4 p-4 rounded-sm sm:grid touch-pan-y bg-neutral-800 "
    >
      <div className="flex flex-col items-center w-full min-h-[12rem] gap-4 touch-pan-y">
        <h2 className="text-xl">{title}.</h2>
        <LexicalTextbox id={id.toString()} />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="p-2 rounded-sm touch-pan-y bg-neutral-700"
        >
          <option>MCQ</option>
          <option>MAQ</option>
          <option>Text</option>
        </select>
      </div>
      {type === "MCQ" || type === "MAQ" ? (
        <div className="flex flex-col items-center justify-center w-[calc(100%+2rem)] -mx-4 -mb-4">
          {/* // TODO: Fields go here */}
        </div>
      ) : (
        // * Ideally should not be shown.
        <textarea
          className="w-full p-2 rounded-sm resize-none sm:h-full placeholder:text-neutral-400 placeholder:opacity-70"
          rows={4}
          disabled
          placeholder="Answer Field"
        ></textarea>
      )}
    </div>
  );
};

export default MobileFaurm;