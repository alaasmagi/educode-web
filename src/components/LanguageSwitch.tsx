import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import i18next from "../../services/i18next";

const LanguageSwitch = () => {
  const [currentLang, setCurrentLang] = useState(i18next.language);

  useEffect(() => {
    const handleLanguageChange = (lng:string) => {
      setCurrentLang(lng);
    };

    i18next.on("languageChanged", handleLanguageChange);

    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === "et" ? "en" : "et";
    i18next.changeLanguage(newLang);
  };

  return (
    <button
      className="hover:bg-button-hover hover:cursor-pointer px-3 py-2 bg-button-dark border-main-blue rounded-2xl border-2"
      onClick={toggleLanguage}
    >
      <img src={currentLang === "en" ? Icons["eng-flag"] : Icons["est-flag"]} className="w-10" />
    </button>
  );
};

export default LanguageSwitch;

