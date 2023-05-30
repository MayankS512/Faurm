import React, { useRef, useState } from "react";

interface FormTitleProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const FormTitle: React.FC<FormTitleProps> = ({ title, setTitle }) => {
  const [edit, setEdit] = useState(false);
  const old = useRef(title);

  return edit ? (
    <textarea
      required
      // w-full sm:w-1/2 lg:w-full
      className="w-full break-all min-h-[3rem] p-2 my-2 overflow-hidden text-2xl text-center rounded-sm resize-none bg-neutral-800 outline-none focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
      defaultValue={title}
      autoFocus={true}
      onChange={(e) => {
        // setTitle(e.target.value);

        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
      onFocus={(e) => {
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";

        e.target.select();
        // setOld(title);
        old.current = title;
      }}
      onBlur={(e) => {
        setEdit(false);
        // if (e.target.value === "") {
        //   // setTitle(old);
        //   setTitle(old.current);
        // } else {
        if (e.target.value !== "") {
          setTitle(e.target.value.trim());
        }
      }}
      rows={1}
    ></textarea>
  ) : (
    <h2
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Tab") return;
        if (e.key === " " || e.key === "Enter") setEdit(true);
        e.preventDefault();
      }}
      onDoubleClick={() => setEdit(true)}
      // w-full sm:w-1/2 lg:w-full
      className="w-full p-2 my-2 text-2xl text-center break-all whitespace-pre-wrap rounded-sm outline-none focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
    >
      {title ?? ""}
    </h2>
  );
};

export default FormTitle;
