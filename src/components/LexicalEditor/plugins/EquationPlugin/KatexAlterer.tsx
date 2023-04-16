import { useCallback, useState } from "react";

import KatexRenderer from "./KatexRenderer";

type Props = {
  initialEquation?: string;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = "",
}: Props): JSX.Element {
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);

  const onClick = useCallback(() => {
    onConfirm(equation, inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  return (
    <>
      <div className="flex flex-row justify-between my-2 overflow-hidden">
        Inline
        <input className="text-neutral-900" type="checkbox" checked={inline} onChange={onCheckboxChange} />
      </div>
      <div className="flex flex-row justify-between my-2 overflow-hidden">Equation </div>
      <div className="flex flex-row justify-center my-2 overflow-hidden">
        {inline ? (
          <input
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="w-full p-2 resize-none"
          />
        ) : (
          <textarea
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="w-full p-2 resize-none"
          />
        )}
      </div>
      <div className="flex flex-row justify-between my-2 overflow-hidden">Visualization </div>
      <div className="flex flex-row justify-center my-2 overflow-hidden">
        <KatexRenderer
          equation={equation}
          inline={false}
          onDoubleClick={() => null}
        />
      </div>
      <div className="flex flex-row justify-end mt-5 mb-0 overflow-hidden">
        <button
          className="p-2 bg-neutral-700 text-neutral-200 text-2xl select-none"
          onClick={onClick}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
