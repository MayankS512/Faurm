import DndContainer from "@/components/DndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import SortableItem from "@/components/SortableItem";
import { PlusIcon } from "@radix-ui/react-icons";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Test = () => {
  const [items, setItems] = useState(["a", "b", "c", "d", "e", "f"]);
  const add = () => {
    setItems((prev) => [...prev, String.fromCharCode(prev.length + 97)]);
  };

  const [dragPosition, setDragPosition] = useState<[number, number]>();

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  // useMotionValueEvent(x, "change", (val) => {
  //   console.log(val);
  // });

  useEffect(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const sliderRect = sliderRef.current?.getBoundingClientRect();

    if (!(containerRect && sliderRect && dragPosition)) return;
    const xFix = (sliderRect.width - containerRect.width) / 2;

    const autoScroll = () => {
      if (dragPosition[0] <= containerRect.left + 100) {
        if (containerRect.left <= x.get() - xFix) {
          return;
        }
        x.set(x.get() + 1);
      }
      if (dragPosition[1] >= containerRect.right - 100) {
        if (containerRect.right >= x.get() - xFix + sliderRect.width) {
          return;
        }
        x.set(x.get() - 1);
      }
    };

    const interval = setInterval(autoScroll, 10);

    return () => clearInterval(interval);
  }, [dragPosition, x]);

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-20">
      <RoundedButton
        className="outline-none bg-neutral-800 focus-visible:ring-2 ring-neutral-200"
        onClick={add}
      >
        <PlusIcon height={30} width={30} />
      </RoundedButton>
      <motion.div
        ref={containerRef}
        // onPan={(_evt, info) => {
        //   // console.log(info.point);
        //   x.set(info.delta.x + x.get());
        // }}
        className="flex items-center justify-center w-full overflow-hidden bg-neutral-700"
      >
        <motion.div
          ref={sliderRef}
          drag="x"
          style={{ x }}
          onDrag={(_evt, info) => {
            // console.log(info.point.x, containerRef.current?.clientWidth);
          }}
          // Switch to left,right:0 when width less than container, then containerRef
          dragConstraints={
            (sliderRef.current?.clientWidth ?? 0) >
            (containerRef.current?.clientWidth ?? 0)
              ? containerRef
              : { left: 0, right: 0 }
          }
          className="flex items-center justify-center gap-2 p-2 w-fit bg-neutral-500"
        >
          <DndContainer<string>
            items={items}
            orientation="horizontal"
            setItems={setItems}
            draggingEnd={() => {
              setDragPosition(undefined);
            }}
            whileDragging={(e) => {
              const objectRect = e.active.rect.current.translated;
              const containerRect =
                containerRef.current?.getBoundingClientRect();
              const sliderRect = sliderRef.current?.getBoundingClientRect();

              if (!(objectRect && containerRect && sliderRect)) return;

              setDragPosition([objectRect.left, objectRect.right]);

              const xFix = (sliderRect.width - containerRect.width) / 2;

              const autoScroll = () => {
                if (objectRect.left <= containerRect.left + 100) {
                  if (containerRect.left <= sliderRect.left) {
                    return;
                  }
                  x.set(x.get() + 0.2);
                }
                if (objectRect.right >= containerRect.right - 100) {
                  if (containerRect.right >= sliderRect.right) {
                    return;
                  }
                  x.set(x.get() - 0.2);
                }
              };
            }}
          >
            {/* <GetInfo setState={setDndState} /> */}
            {items.map((item, idx) => (
              <SortableItem
                className="rounded-full outline-none focus-visible:ring-2 ring-neutral-200"
                id={item}
                key={item}
              >
                <RoundedButton className="outline-none bg-neutral-800">
                  {item}
                </RoundedButton>
              </SortableItem>
            ))}
          </DndContainer>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Test;
