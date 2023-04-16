import katex from "katex";
import { useEffect, useRef } from "react";

export default function KatexRenderer({
  equation,
  inline,
  onDoubleClick,
}: Readonly<{
  equation: string;
  inline: boolean;
  onDoubleClick: () => void;
}>): JSX.Element {
  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: "#cc0000",
        output: "html",
        strict: "warn",
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return (
    // Refer https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/ui/KatexRenderer.tsx, img tags used to avoid undesired behaviour on Android devices.
    <>
      <img src="#" alt="" />
      <span
        role="button"
        tabIndex={-1}
        onDoubleClick={onDoubleClick}
        ref={katexElementRef}
      />
      <img src="#" alt="" />
    </>
  );
}
