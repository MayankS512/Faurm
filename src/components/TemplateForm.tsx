import React, { useState } from "react";

const TemplateForm: React.FC<{ title?: string | number }> = ({
  title = "Z",
}) => {
  const [type, setType] = useState<"MCQ" | "MAQ" | "Text">("MCQ");

  return (
    <div className="flex flex-col items-center w-full gap-4 p-4 rounded-sm sm:flex-row touch-pan-y bg-neutral-800 ">
      <div className="flex flex-col items-center w-full gap-4 touch-pan-y">
        <h2 className="text-xl">{title}.</h2>
        <textarea
          className="w-full p-2 rounded-sm resize-none touch-pan-y placeholder:text-neutral-400 placeholder:opacity-70"
          rows={4}
          placeholder="Enter Question"
        ></textarea>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="p-2 rounded-sm touch-pan-y bg-neutral-700"
        >
          <option>MCQ</option>
          <option>MAQ</option>
          <option>Text</option>
        </select>
      </div >
      {type === "MCQ" || type === "MAQ" ? (
        <div className="flex flex-col items-center w-full gap-4 touch-pan-y">
          <input
            type="text"
            className="w-full p-2 rounded-sm touch-pan-y placeholder:text-neutral-400 placeholder:opacity-70"
            placeholder="Input"
          />
          <input
            type="text"
            className="w-full p-2 rounded-sm touch-pan-y placeholder:text-neutral-400 placeholder:opacity-70"
            placeholder="Input"
          />
          <input
            type="text"
            className="w-full p-2 rounded-sm touch-pan-y placeholder:text-neutral-400 placeholder:opacity-70"
            placeholder="Input"
          />
          <input
            type="text"
            className="w-full p-2 rounded-sm touch-pan-y placeholder:text-neutral-400 placeholder:opacity-70"
            placeholder="Input"
          />
        </div>
      ) : (
        // * Ideally should not be shown.
        <textarea
          className="w-full p-2 rounded-sm resize-none sm:h-full placeholder:text-neutral-400 placeholder:opacity-70"
          rows={2}
          disabled
          placeholder="Enter Answer"
        ></textarea>
      )}
    </div>
  );
};

export default TemplateForm;
