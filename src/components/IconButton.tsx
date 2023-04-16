import React from "react";

interface IconButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  label?: string;
  rounded?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
  label,
  rounded = true,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={label}
      className={`${rounded ? "rounded-full" : "rounded-sm"} ${
        disabled ? "text-neutral-400" : "text-neutral-200 hover:bg-neutral-700 "
      } ${
        active ? "bg-neutral-600" : ""
      } p-1 outline-none focus-visible:ring-2 ring-neutral-200 select-none text-neutral-200 ring-offset-neutral-800 focus-visible:bg-neutral-700 ring-offset-1 ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
