import { RoundedButton } from "@/components/RoundedButton";
import TemplateForm from "@/components/TemplateForm";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Test = () => {
  const items = [0, 1, 2, 3, 4, 5, 6, 7];
  const [open, setOpen] = useState(0);
  // const [tuple, setTuple] = useState<[number | null, number]>([null, open]);
  const [dir, setDir] = useState<1 | -1>(1);

  // if (tuple[1] !== open) {
  //   setTuple((prev) => [prev[1], open]);
  // }

  const nextItem = () => {
    setOpen((prev) => (prev + 1) % items.length);
    setDir(1);
    // setTuple((prev) => [prev[1], prev[1] + 1]);
  };

  const prevItem = () => {
    setOpen((prev) => (prev - 1 + items.length) % items.length);
    setDir(-1);
    // setTuple((prev) => [prev[1], prev[1] - 1]);
  };

  const { register, handleSubmit } = useForm({
    defaultValues: {
      normal: "Default",
    },
  });

  // const direction = tuple[1] > tuple[0]! ? 1 : -1;
  // console.log(direction);

  return (
    <main className="flex flex-col w-screen h-screen bg-neutral-900">
      <Head>
        <title>Test</title>
      </Head>
      <div className="flex justify-between w-full px-4 mt-4">
        <RoundedButton
          label="previous"
          onClick={prevItem}
          className="bg-neutral-800"
        >
          {"<"}
        </RoundedButton>
        <div className="flex items-center h-full">{open}</div>
        <RoundedButton
          label="next"
          onClick={nextItem}
          className="bg-neutral-800"
        >
          {">"}
        </RoundedButton>
      </div>
      <div className="relative p-4 mx-10 my-auto overflow-hidden">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            onPanEnd={(event, info) => {
              if (info.offset.x < -40) {
                nextItem();
              }
              if (info.offset.x > 40) {
                prevItem();
              }

              event.stopImmediatePropagation();
            }}
            key={open}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={dir}
            transition={{ duration: 0.4 }}
          >
            <TemplateForm title={open} id={open} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

const variants = {
  enter: (custom: number) => ({
    x: 600 * custom,
  }),
  center: { x: 0 },
  exit: (custom: number) => ({
    x: -600 * custom,
  }),
};

export default Test;

// Example of Code Box
/*
<div className="relative mx-auto my-auto overflow-hidden text-xl rounded-sm bg-neutral-800 w-60 group">
        <div className="p-4 pt-6 overflow-x-auto whitespace-nowrap">
          The quick brown fox jumped over the lazy dog.
        </div>
        <div className="absolute top-0 right-0 z-20 p-2 text-sm font-thin transition-all duration-300 opacity-70 group-hover:opacity-100">
          Whatever
        </div>
        <div className="absolute top-0 right-0 z-10 p-2 text-sm text-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 bg-neutral-800 blur-md">
          Whatever
        </div>
      </div>
*/
