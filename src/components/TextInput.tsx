import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  UseFormRegisterReturn,
  useForm,
} from "react-hook-form";
import IconButton from "./IconButton";
import { PlusIcon } from "@heroicons/react/24/outline";

interface TextInputProps {
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  register?: UseFormRegisterReturn<string>;
  rounded?: boolean;
  version?: 1 | 2 | 3;
  side?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder = "Input",
  value,
  onChange,
  className,
  style,
  register,
  rounded,
  version = 3,
  side,
}) => {
  const [hover, setHover] = useState(false);
  // useEffect(() => {
  //   console.log("state");
  // }, [hover]);

  return (
    <div
      onPointerEnter={() => {
        side && setHover(true);
      }}
      onFocus={() => {
        side && setHover(true);
      }}
      onBlur={() => {
        side && setHover(false);
      }}
      onPointerLeave={() => {
        side && setHover(false);
      }}
    >
      <input
        {...register}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onDoubleClick={side}
        onFocus={() => {
          side && setHover(true);
        }}
        onKeyDownCapture={(e) => {
          e.stopPropagation();
        }}
        className={`focus:outline-none relative placeholder:select-none ring-offset-1 focus:ring-2 w-full ring-opacity-80 py-1 dark:ring-offset-neutral-800 ring-neutral-200
    ${className}
    ${rounded ? "rounded-full px-3" : "rounded-sm px-2"} 
    ${
      version === 1
        ? "bg-neutral-700 placeholder:text-neutral-400 text-neutral-200 selection:bg-neutral-300 selection:text-neutral-900 "
        : ""
    } 
    ${
      version === 2
        ? "bg-neutral-400 placeholder:text-neutral-700 text-neutral-900 selection:bg-neutral-800 selection:text-neutral-200 "
        : ""
    } 
    ${
      version === 3
        ? "bg-neutral-900 placeholder:text-neutral-400 text-neutral-200 selection:bg-neutral-300 selection:text-neutral-900 "
        : ""
    } `}
        style={style}
      />
      {side && hover && (
        <IconButton
          onClick={side}
          className="absolute z-10 -translate-y-1/2 bg-red-800 hover:bg-opacity-90 lg:block hidden hover:bg-red-700 bg-opacity-70 -right-[10px] top-1/2"
        >
          <PlusIcon strokeWidth={3} className="w-3 h-3 rotate-45" />
        </IconButton>
      )}
    </div>
  );
};

export default TextInput;
