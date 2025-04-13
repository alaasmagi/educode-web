import { useTranslation } from "react-i18next";
import "../App.css";
import LanguageSwitch from "../components/LanguageSwitch";
import NormalButton from "../components/NormalButton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import SuccessMessage from "../components/SuccessMessage";

function InitialSelectionView() {
  const { message } = useParams() ?? null;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
      fetchUserData();
        message && setSuccessMessage(String(message)); 
        setTimeout (() => setSuccessMessage(null), 3000); 
    }, []);
  
    const fetchUserData = async () => {
      const userData = await GetOfflineUserData();
      if (userData !== null) {
        navigate("/Home");
      }
    };
  
  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="w-xl" />
          <div className="flex flex-col gap-3.5">
            {successMessage && <SuccessMessage text={t(successMessage)}/>}
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
