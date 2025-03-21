import { useState } from "react";
import { Icons } from "./Icons"; // Assuming you have an Icons object

interface TextBoxProperties {
  placeHolder: string;
  icon: keyof typeof Icons;
  isPassword?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (text: string) => void;
}

export default function TextBox({
  placeHolder,
  icon,
  isPassword = false,
  value,
  disabled = false,
  onChange,
}: TextBoxProperties) {
  const [isTextVisible, setIsTextVisible] = useState(!isPassword);

  return (
    <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs">
      <div className="flex flex-row w-max-full items-center gap-1.5">
        <img src={Icons[icon]} className="h-7" alt={icon} />
        <input
          type={isTextVisible ? "text" : "password"}
          value={value}
          placeholder={placeHolder}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          className="outline-none text-main-text w-10/12 text-lg"
        />
        {isPassword && (
          <button
            onClick={() => setIsTextVisible((prev) => !prev)}
            className="pr-1 hover:cursor-pointer"
          >
            {isTextVisible ? (
              <img
                src={Icons["visibility-on"]}
                className="h-7"
                alt="User Icon"
              />
            ) : (
              <img
                src={Icons["visibility-off"]}
                className="h-7"
                alt="User Icon"
              />
            )}
          </button>
        )}
      </div>
      <div className="w-full h-px bg-main-text mt-2"></div>
    </div>
  );
}
