import type { Ref, RefObject, ChangeEvent } from "react";
import { forwardRef } from "react";

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
  onHide?: () => void;
};

function EquationEditor(
  { equation, setEquation, inline, onHide = () => {} }: BaseEquationEditorProps,
  forwardedRef: Ref<HTMLInputElement | HTMLTextAreaElement>
): JSX.Element {
  const onChange = (event: ChangeEvent) => {
    setEquation((event.target as HTMLInputElement).value);
  };

  return !(inline && forwardedRef instanceof HTMLInputElement) ? (
    <span>
      <span className="text-left text-neutral-400">$</span>
      <input
        className="p-0 m-0 border-none outline-none resize-none text-neutral-200 bg-inherit"
        type="text"
        onKeyDown={(e) => {
          // console.log(e.key);
          if (e.key === "Enter") {
            // e.stopPropagation();
            // e.currentTarget.parentElement?.focus();
            onHide();
          }
        }}
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={forwardedRef as RefObject<HTMLInputElement>}
      />
      <span className="text-left text-neutral-400">$</span>
    </span>
  ) : (
    <div className="p-2 -mx-1 rounded-sm bg-neutral-900">
      <span className="text-left text-neutral-400">{"$$\n"}</span>
      <textarea
        className="w-full p-0 m-0 border-none outline-none resize-none text-neutral-200 bg-inherit"
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={forwardedRef as RefObject<HTMLTextAreaElement>}
      />
      <span className="text-left text-neutral-400">{"$$\n"}</span>
    </div>
  );
}

export default forwardRef(EquationEditor);
