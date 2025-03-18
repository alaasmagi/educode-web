import { useState } from "react";
import { Icons } from "./Icons"; // Assuming you have an Icons object

interface UnderLineTextProperties {
  text: string;
}

export default function UnderLineText({ text }: UnderLineTextProperties) {
  return (
    <span className="">{text}</span>
  );
}
