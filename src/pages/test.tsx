import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";

const MicIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
    >
      <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
      <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
    </svg>
  );
};

export default function Home() {
  const [query, setQuery] = useState("");
  const commands = [
    {
      cmd: /(A|a)dd {1}\d/,
      str: (x?: number) => `Add ${x ? x : "X"}`,
      fn: (x: number) => {
        setTest((prev) => [...prev, x]);
      },
    },
    {
      cmd: /(R|r)emove {1}\d/,
      str: (i?: number) => `Remove ${i ? i : "index"}`,
      fn: (i: number) => {
        if (i >= test.length) return;
        setTest((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
      },
    },
    {
      cmd: /(S|s)witch {1}\d (W|w)ith {1}\d/,
      str: (i?: number, j?: number) =>
        `Switch ${i ? i : "index"} with ${j ? j : "index"}`,
      fn: (i: number, j: number) => {
        if (i === j) return;
        if (i >= test.length || j >= test.length) return;
        setTest((prev) => {
          const res = [...prev];
          res[i] = prev[j];
          res[j] = prev[i];

          return res;
        });
      },
    },
    {
      cmd: /(M|m)ove {1}\d (T|t)o {1}\d/,
      str: (i?: number, j?: number) =>
        `Move ${i ? i : "index"} to ${j ? j : "index"}`,
      fn: (i: number, j: number) => {
        if (i === j) return;
        if (i >= test.length || j >= test.length) return;
        if (i >= j)
          setTest((prev) => [
            ...prev.slice(0, j),
            prev[i],
            ...prev.slice(j, i),
            ...prev.slice(i + 1),
          ]);
        else
          setTest((prev) => [
            ...prev.slice(0, i),
            ...prev.slice(i + 1, j),
            prev[i],
            ...prev.slice(j),
          ]);
      },
    },
  ];
  const [test, setTest] = useState<number[]>([]);
  const filteredCommands = query
    ? commands
        .map((entry) => {
          const values = query.match(/\d+/g)?.map((value) => +value) ?? [];
          const cmdStr = entry.str(...values);

          if (
            cmdStr.toLowerCase().includes(query.toLowerCase())
              ? cmdStr
              : undefined
          )
            return cmdStr;
        })
        .filter((entry) => entry)
    : [];
  console.log(filteredCommands);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) return;

    commands.forEach((entry) => {
      if (entry.cmd.test(query)) {
        const values = query.match(/\d+/g)?.map((value) => +value) ?? [];
        switch (values.length) {
          case 1:
            entry.fn(values[0]);
            break;
          case 2:
            entry.fn(values[0], values[1]);
            break;
          case 3:
            entry.fn(values[0], values[1], values[2]);
            break;
          default:
            return;
        }
      }
    });
  };

  useEffect(() => {
    console.log(test);
  }, [test]);

  return (
    <>
      <Head>
        <title>Faurm</title>
        <meta
          name="description"
          content="Create and share simple forms in the easiest way possible."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 w-80">
          <div className="flex w-full gap-2 p-2 border border-solid rounded-sm outline-none border-neutral-600 bg-neutral-800 text-neutral-100 placeholder:text-neutral-400 focus-within:ring-2 ring-neutral-200">
            <button type="button">
              <MicIcon className="text-neutral-400 active:text-neutral-100" />
            </button>
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="w-full bg-transparent outline-none"
              placeholder="Enter Command"
            />
          </div>
          {filteredCommands.length ? (
            <ul className="flex flex-col gap-2 px-4 border border-solid rounded-sm border-neutral-600 bg-neutral-800">
              {filteredCommands.map((entry) => {
                if (!entry) return null;
                return (
                  <li
                    className="py-4 border-b-2 border-solid border-neutral-600 last:border-b-0"
                    key={entry}
                  >
                    {entry}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </form>
      </main>
    </>
  );
}
