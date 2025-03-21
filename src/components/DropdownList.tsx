import { useState } from "react";
import { Icons } from "./Icons";

interface DropDownListProperties {
  icon: keyof typeof Icons;
  options: { value: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  value?: string;
}

const DropDownList: React.FC<DropDownListProperties> = ({
  icon,
  options,
  value,
  label,
  onChange,
}) => {
  return (
    <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6  md:min-w-xs">
      <div className="flex flex-row w-max-screen items-center gap-1.5">
        <img src={Icons[icon]} className="h-7" />
        <select
          value={value}
          onChange={onChange}
          className="outline-none text-main-text w-full text-lg"
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-px bg-main-text mt-2"></div>
    </div>
  );
};

export default DropDownList;
