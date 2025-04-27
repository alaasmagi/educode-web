import React from "react";
import { Icons } from "./Icons";

interface DataTextProperties {
    icon: keyof typeof Icons;
    text: string;
}

const DataText: React.FC<DataTextProperties> = ({ icon, text }) => {
  return (
    <div className="flex flex-row gap-3 items-center">
        <img src={Icons[icon]} className="h-7" alt={`${icon}-Icon`} />
        <span className="text-xl">{text}</span>
    </div>
  );
};

export default DataText;