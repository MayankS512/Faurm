import React from "react";
import { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  register?: UseFormRegisterReturn<string>;
  rounded?: boolean;
  version?: 1 | 2 | 3;
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
}) => {
  return (
    <input
      {...register}
      type="text"
      placeholder={placeholder}
      // value={value}
      // onChange={onChange}
      onKeyDownCapture={(e) => {
        e.stopPropagation();
      }}
      className={`focus:outline-none placeholder:select-none ring-offset-1 focus:ring-2 ring-opacity-80 py-1 dark:ring-offset-neutral-800 ring-neutral-200
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
  );
};

export default TextInput;
