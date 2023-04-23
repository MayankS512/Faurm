import DndContainer from "@/components/DndContainer";
import FormContainer from "@/components/FormContainer";
import FormTitle from "@/components/FormTitle";
import { RoundedButton } from "@/components/RoundedButton";
import SortableItem from "@/components/SortableItem";
import TemplateForm from "@/components/TemplateForm";
import { useFaurmStore } from "@/store/store";
import { DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

// TODO: Modify breakpoints or switch to @container queries to account for height as well (check iPhone X and iPad in inspect).

// const miniView: React.FC<{
//   items: number[];
//   setItems: React.Dispatch<React.SetStateAction<number[]>>;
// }> = ({ items, setItems }) => {
//   return (
//     <div className={``}>
//       {items.map((item, idx) => (
//         <div key={item}>{item}</div>
//       ))}
//     </div>
//   )
// };

export default function Create() {
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);
  const [clouds, setClouds] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState<number>();
  // const open = useFaurmStore((state) => state.open);
  // const setOpen = useFaurmStore((state) => state.setOpen);

  const addItem = () => {
    setItems((prev) => [...prev, (prev[prev.length - 1] ?? 0) + 1]);
  };

  const container = useRef<HTMLDivElement>(null);
  const lastOpen = useRef<number>();
  // const constraint = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container,
  });

  // const x = useMotionValue(0);
  const x: MotionValue<number> = useSpring(0, {
    stiffness: 400,
    damping: 30,
  });
  // const progress = useTransform(x, (latest) => latest / 160);
  // const bg = useTransform(
  //   progress,
  //   [0, 1],
  //   ["rgb(23, 23, 23)", "rgb(38, 38, 38)"]
  // );
  // const control = useDragControls();

  useMotionValueEvent(scrollYProgress, "change", (val) => {
    if (val === 0) {
      setClouds([0, 1]);
    } else if (val === 1) {
      setClouds([1, 0]);
    } else {
      setClouds([1, 1]);
    }
  });

  // scrollYProgress.on("change", (val) => {
  //   if (val === 0) {
  //     setClouds([0, 1]);
  //   } else if (val === 1) {
  //     setClouds([1, 0]);
  //   } else {
  //     setClouds([1, 1]);
  //   }
  // });

  const [width, setWidth] = useState<number>(0);
  const resizeHandler = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const [dragging, setDragging] = useState<UniqueIdentifier>();

  return (
    <div
      // style={{ backgroundColor: bg }}
      // onPointerDown={(e) => control.start(e)}
      className="flex @container  overflow-hidden h-screen bg-neutral-900 "
    >
      <Head>
        <title>Faurm | Create</title>
        <meta
          name="description"
          content="Create and share forms in the easiest way possible."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {1024 > width ? (
        <motion.section
          // style={{ opacity: progress }}
          onPan={(_evt, { delta }) => {
            if (dragging) return;
            x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
          }}
          onPanEnd={(_evt, { offset }) => {
            if (x.get() > 80) {
              x.set(160);
            } else {
              x.set(0);
            }

            // if (offset.x > 0) {
            //   if (offset.x > 50) {
            //     x.set(160);
            //   } else {
            //     x.set(0);
            //   }
            // } else {
            //   if (offset.x < -50) {
            //     x.set(0);
            //   } else {
            //     x.set(160);
            //   }
            // }
          }}
          // onPointerDown={(e) => control.start(e)}
          className="absolute top-0 left-0 w-40 h-screen py-8 overflow-auto bg-neutral-800 touch-pan-y"
        >
          <div className="flex flex-col items-center gap-8 ">
            <DndContainer<number>
              items={items}
              setItems={setItems}
              setDrag={setDragging}
              Overlay={({ children }) => (
                <RoundedButton>{children}</RoundedButton>
              )}
            >
              {items.map((item, idx) => (
                <SortableItem className="rounded-full" id={item} key={item}>
                  <RoundedButton
                    onClick={() => {
                      if (!container.current) return;

                      container.current.children[idx].scrollIntoView();
                      setTimeout(() => x.set(0), 0);
                      // x.set(0);
                    }}
                  >
                    {idx + 1}
                  </RoundedButton>
                </SortableItem>
              ))}
            </DndContainer>
          </div>
        </motion.section>
      ) : null}

      {/* <div
        ref={constraint}
        aria-hidden
        className="fixed w-[calc(100%+10rem)]"
      ></div> */}

      {1024 > width ? (
        <motion.main
          // drag="x"
          // dragConstraints={{ left: 0, right: 160 }}
          // dragConstraints={constraint}
          // dragElastic={0.1}
          // dragControls={control}
          onPan={(_evt, { delta }) => {
            x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
          }}
          onPanEnd={(_evt, { offset }) => {
            if (x.get() > 80) {
              x.set(160);
            } else {
              x.set(0);
            }

            // if (offset.x > 0) {
            //   if (offset.x > 50) {
            //     x.set(160);
            //   } else {
            //     x.set(0);
            //   }
            // } else {
            //   if (offset.x < -50) {
            //     x.set(0);
            //   } else {
            //     x.set(160);
            //   }
            // }
          }}
          style={{ x }}
          className="flex lg:flex-col sm:flex-row flex-col items-center h-full sm:justify-evenly overflow-hidden w-full gap-4 p-4 sm:pb-4 pb-10 z-[5] sm:gap-0 touch-pan-y bg-neutral-900 text-neutral-200"
        >
          {/* <h1
          className="max-w-full p-2 my-4 text-2xl text-center rounded-sm focus:bg-neutral-800"
          contentEditable
          onBlur={(e) => setTitle(e.target.innerText)}
        >
          {title}
        </h1> */}

          <FormTitle />
          <div className="relative flex flex-col flex-1 w-full overflow-y-auto scroll-smooth lg:hidden sm:flex-auto sm:max-h-full sm:p-4 touch-pan-y">
            {/*
          // ? Could potentially replace Animate Presence with Transition (Headless UI) since plain divs do not cause issues in perf, adding / removing from DOM tree might be more expensive. 
          */}
            <AnimatePresence>
              {items.length > 1 && clouds[0] ? (
                <motion.div
                  key="top"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 left-0 z-10 w-full h-10 pointer-events-none bg-gradient-to-b touch-pan-y from-neutral-900 to-transparent"
                ></motion.div>
              ) : null}
              <div
                ref={container}
                className="flex flex-col h-full gap-4 overflow-auto touch-pan-y"
              >
                {items.map((item, idx) => (
                  // TODO: title should be idx
                  <TemplateForm id={item} key={item} title={idx + 1} />
                ))}
              </div>
              {items.length > 1 && clouds[1] ? (
                <motion.div
                  key="bottom"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-0 left-0 z-10 w-full h-10 pointer-events-none bg-gradient-to-t touch-pan-y from-neutral-900 to-transparent"
                ></motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.main>
      ) : (
        <main className="flex flex-col items-center w-full h-full gap-4 p-4 justify-evenly bg-neutral-900 text-neutral-200">
          <FormTitle />
          <div className="flex items-center justify-center w-full gap-4 p-4 overflow-auto min-w-fit">
            <DndContainer<number>
              items={items}
              setItems={setItems}
              orientation="horizontal"
              keyboardEvents={{
                start() {
                  // console.log("started");
                  lastOpen.current = open;
                  setOpen(undefined);
                },
                end() {
                  // console.log("ended");
                  setOpen(lastOpen.current);
                  lastOpen.current = undefined;
                },
              }}
              // ? Might go back to putting drag overlay outside
              Overlay={({ children }) => (
                <RoundedButton className="text-neutral-200 bg-neutral-800">
                  {children}
                </RoundedButton>
              )}
            >
              {items.map((item, _idx) => (
                <SortableItem
                  className={open === item ? "rounded-md" : "rounded-full"}
                  id={item}
                  key={item}
                >
                  {/* // TODO: Maybe find a better way to handle the layout shift during keyboard sort */}
                  {lastOpen.current === undefined ? (
                    <FormContainer
                      id={item}
                      // TODO: title should be idx
                      title={item}
                      open={open === item}
                      onClick={() => {
                        setOpen((prev) => (prev === item ? undefined : item));
                      }}
                    />
                  ) : (
                    <RoundedButton className="text-neutral-200 bg-neutral-800">
                      {item}
                    </RoundedButton>
                  )}
                  {/* <FormContainer
                    id={item}
                    // TODO: title should be idx
                    title={item}
                    open={open === item}
                    onClick={() => {
                      setOpen((prev) => (prev === item ? undefined : item));
                      // setOpen(open === item ? undefined : item);
                    }}
                  /> */}
                </SortableItem>
              ))}
            </DndContainer>
          </div>
        </main>
      )}
      <button
        onClick={addItem}
        className="fixed z-20 flex items-center justify-center text-3xl font-light rounded-full lg:hidden h-14 w-14 bottom-5 right-5 bg-neutral-800 drop-shadow-xl"
      >
        +
      </button>
    </div>
  );
}
