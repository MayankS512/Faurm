import React, { useEffect, useState } from "react";

const COLS = 20;
const ROWS = 11;

const Element: React.FC<{
  children?: React.ReactNode;
  idx: number;
  anim: number;
}> = ({ children, idx, anim }) => {
  return (
    <span
      style={{
        left: (idx % COLS) * 40,
        top: Math.floor((idx / COLS) % ROWS) * 40,
        transform: `scale(${
          ((anim -
            ((idx % COLS) +
              Math.floor(idx / COLS > 5 ? idx / COLS : (COLS - idx) / COLS)) *
              0.1) %
            1) +
          1
        })`,
      }}
      className="absolute origin-center p-4 select-none"
    >
      {children ?? "L"}
    </span>
  );
};

const generateArray = (input: string) => {
  const str: string[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    str.push(input[i % input.length]);
  }

  return str;
};

export default function Grid() {
  const items = new Array<number>(COLS * ROWS).fill(1);

  const [anim, setAnim] = useState(0);
  const str = generateArray("SENOI");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnim((prev) => prev + 0.01);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-900 w-screen h-screen text-xl">
      {str.map((s, idx) => (
        <Element idx={idx} key={idx} anim={anim}>
          {s}
        </Element>
      ))}
    </div>
  );
}
