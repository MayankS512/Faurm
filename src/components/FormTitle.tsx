import { useState } from "react";

const FormTitle = () => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("Form Title");

  // ? Could try replacing with useRef
  const [old, setOld] = useState(title);

  return edit ? (
    <textarea
      required
      className="w-full lg:w-full break-all min-h-[3rem] p-2 my-2 overflow-hidden text-2xl text-center rounded-sm resize-none sm:w-1/2 bg-neutral-800"
      value={title}
      autoFocus={true}
      onChange={(e) => {
        setTitle(e.target.value);

        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
      onFocus={(e) => {
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";

        e.target.select();
        setOld(title);
      }}
      // onPointerDownCapture={(e) => e.stopPropagation()}
      // onKeyDownCapture={(e) => {
      //   if (e.key === "Enter") {
      //     e.preventDefault();
      //   }
      // }}
      // onPointerEnter={(e) => {
      //   console.log("Entered");
      // }}
      rows={1}
      onBlur={() => {
        setEdit(false);
        if (title === "") {
          setTitle(old);
        } else {
          setTitle((prev) => prev.trim());
        }
      }}
    ></textarea>
  ) : (
    <h1
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Tab") return;
        if (e.key === " " || e.key === "Enter") setEdit(true);
        e.preventDefault();
      }}
      onDoubleClick={() => setEdit(true)}
      className="w-full p-2 my-2 text-2xl text-center break-all whitespace-pre-wrap lg:w-full sm:w-1/2 "
    >
      {title ?? ""}
    </h1>
  );
};

export default FormTitle;
