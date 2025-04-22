import { useTranslation } from "react-i18next";
import "../App.css";
import LanguageSwitch from "../components/LanguageSwitch";
import NormalButton from "../components/NormalButton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCurrentLanguage, GetOfflineUserData } from "../businesslogic/UserDataOffline";
import SuccessMessage from "../components/SuccessMessage";
import { FetchAndSaveUserDataByUniId, TestConnection } from "../businesslogic/UserDataFetch";
import i18next from "i18next";
import NormalMessage from "../components/NormalMessage";

function InitialSelectionView() {
  const { message } = useParams() ?? null;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
      init();
        message && setSuccessMessage(t(String(message))); 
        setTimeout (() => setSuccessMessage(null), 3000); 
    }, []);

  const init = async () => {
    const connection = await TestConnection();
    const lang = await GetCurrentLanguage();
    if (lang) i18next.changeLanguage(lang);
    if (!connection) {
      !message && setNormalMessage(t("login-again"));
      setTimeout(() => setNormalMessage(null), 3000);
    } else {
      setNormalMessage(null);
    }

    let localData = await GetOfflineUserData();
      const loginSuccess = await FetchAndSaveUserDataByUniId(
        String(localData?.uniId)
      );
      if (typeof(loginSuccess) !== "string") {
        navigate("/Home");
      } else {
        !message && setNormalMessage(t("login-again"));
        setTimeout(() => setNormalMessage(null), 3000);
      }
  }
  
  
  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="w-xl" />
          <div className="flex flex-col gap-3.5">
            {successMessage && <SuccessMessage text={t(successMessage)}/>}
            {normalMessage && <NormalMessage text={t(normalMessage)}/>}
            <NormalButton text={t("log-in")} onClick={() => navigate("/Login")} />
            <NormalButton text={t("register-as-teacher")} onClick={() => navigate("/CreateAccount")} />
            <LanguageSwitch linkStyle={true} />
          </div>
        </div>
      </div>
    </>
  );
}

export default InitialSelectionView;
