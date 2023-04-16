import React from "react";

interface RoundedButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  label?: string;
  className?: string;
}

export const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  onClick,
  disabled = false,
  title,
  label,
  className,
}) => {
  return (
    <button
      // onPointerDownCapture={(e) => e.stopPropagation()}
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={label}
      className={`rounded-full min-w-[100px] min-h-[100px] h-[100px] w-[100px]  text-2xl  flex justify-center items-center ${
        className ?? "bg-neutral-900 text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
};
