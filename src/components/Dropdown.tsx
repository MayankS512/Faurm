import React, { MouseEvent, use, useEffect, useRef, useState } from "react";
import { Listbox, Portal } from "@headlessui/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// ? This needs to be reworked into a better component, a lot of unused code that might be useful later.
// * Ideally, need native dropdown behavior on mobile devices while showing a custom dropdown (which this is) on desktops.

interface DropdownProps {
  value: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  name: string;
  children?: React.ReactNode;
  label?: string;
  length?: number;
}

interface DropdownOptionProps {
  value: any;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  value,
  disabled = false,
  children,
}) => {
  return (
    <Listbox.Option
      disabled={disabled}
      className={({ active }) => ` ${active && "bg-neutral-700"} 
     text-neutral-200 rounded-sm px-2 py-1`}
      value={value}
    >
      {children}
    </Listbox.Option>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  disabled = false,
  name,
  label,
  children,
  length = 6,
}) => {
  // const btnRef = useRef<HTMLDivElement>(null);
  // const optionsRef = useRef<HTMLElement>(null);

  // const close = useStore((state) => state.close);
  // const display = useRef<boolean>(false);

  // const [options, setOptions] = useState(false);
  // const [coords, setCoords] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // });

  // useEffect(() => {
  //   const resizeObs = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       setCoords({
  //         x: entry.target.getBoundingClientRect().x,
  //         y: entry.target.getBoundingClientRect().y,
  //       });
  //     }
  //   });

  //   function handleScroll() {
  //     if (btnRef.current === null) return;
  //     setCoords({
  //       x: btnRef.current.clientHeight,
  //       y: btnRef.current.clientWidth,
  //     });
  //   }

  //   if (btnRef.current === null || btnRef.current?.parentElement === null)
  //     return;
  //   resizeObs.observe(btnRef.current.parentElement);
  //   btnRef.current.parentElement.addEventListener("scroll", handleScroll);

  //   return;
  // }, []);

  // useEffect(() => {
  //   if (!window) return;

  //   function closeOptions() {
  //     setClose(true);
  //   }

  //   window.addEventListener("resize", closeOptions);

  //   return () => window.removeEventListener("resize", closeOptions);
  // }, []);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <div
          // sm:w-full lg:w-auto
          className={`flex items-center ${
            name.length > 8 ? "first:min-w-[120px]" : "first:min-w-fit"
          } flex-grow min-w-0 gap-2`}
        >
          {label && (
            <Listbox.Label className="w-full min-w-fit">{label}</Listbox.Label>
          )}
          {/*  ref={btnRef} */}
          <div className="relative w-full select-none">
            <Listbox.Button
              onKeyDown={(e) => {
                // e.stopPropagation();
              }}
              aria-label="Formatting options for text style"
              className="flex items-center justify-between w-full gap-2 px-2 py-1 rounded-sm outline-none focus-visible:ring-2 ring-offset-1 focus-visible:bg-neutral-700 ring-neutral-200 ring-offset-neutral-800 hover:bg-neutral-700 text-neutral-200"
            >
              <span className="overflow-x-hidden text-ellipsis whitespace-nowrap">
                {name}
              </span>
              <ChevronDownIcon
                strokeWidth={2}
                className={`w-5 h-5 min-h-[1.25rem] min-w-[1.25rem] ${
                  open ? "-rotate-180" : ""
                } transition duration-100 `}
              />
            </Listbox.Button>
            {/* 
          // * Try using portal again if getting stuck. 
          */}
            {/* {open && !close && (
            <Portal>
              <Listbox.Options
                // static
                // ref={optionsRef}
                style={{
                  top: btnRef.current?.getBoundingClientRect().y,
                  left: btnRef.current?.getBoundingClientRect().x,
                }}
                className="absolute z-10 h-48 max-h-full mt-8 overflow-x-hidden overflow-y-auto rounded-sm shadow-lg outline-none min-w-fit dropdown-scroll whitespace-nowrap text-ellipsis bg-neutral-800 shadow-neutral-900"
              >
                {children}
              </Listbox.Options>
            </Portal>
          )} */}
            <Listbox.Options
              style={{ height: length + "00%" }}
              className="absolute z-10 w-full overflow-x-hidden overflow-y-auto rounded-sm shadow-lg outline-none min-w-fit dropdown-scroll whitespace-nowrap text-ellipsis bg-neutral-800 shadow-neutral-900"
            >
              {children}
            </Listbox.Options>
          </div>
        </div>
      )}
    </Listbox>
  );
};

export default Dropdown;

/*
<Listbox.Options className="outline-none min-w-fit w-full overflow-x-hidden overflow-y-auto h-[600%] dropdown-scroll absolute whitespace-nowrap text-ellipsis bg-neutral-800 shadow-lg shadow-neutral-900 z-10 rounded-sm">
  {children}
</Listbox.Options>
*/
