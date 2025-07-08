import React from "react";

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  name=""
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-5 bg-zinc-900/80 rounded-[10px] outline outline-neutral-700 text-zinc-400 placeholder-zinc-400 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-300 ${className}`}
    />
  );
};

export default InputField;
