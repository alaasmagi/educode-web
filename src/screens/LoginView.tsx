import "../App.css";
import NormalButton from "../layout/components/NormalButton";
import { useNavigate, useParams } from "react-router-dom";
import TextBox from "../layout/components/TextBox";
import NormalLink from "../layout/components/Link";
import ErrorMessage from "../layout/components/ErrorMessage";
import { useEffect, useState } from "react";
import { dismissKeyboard } from "../businesslogic/hooks/DismissKeyboard";
import { FetchAndSaveUserDataByUniId, UserLogin } from "../businesslogic/services/UserDataFetch";
import { GetOfflineUserData } from "../businesslogic/services/UserDataOffline";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../layout/components/LanguageSwitch";
import SuccessMessage from "../layout/components/SuccessMessage";

function LoginView() {
  const { message } = useParams() ?? null;
  const [uniIdInput, setUniIdInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
    message && setSuccessMessage(t(String(message))); 
    setTimeout (() => setSuccessMessage(null), 3000); 
  }, []);

  const fetchUserData = async () => {
    const userData = await GetOfflineUserData();
    if (userData !== null) {
      navigate("/Home");
    }
  };

  const handleLogin = async () => {
    dismissKeyboard();
    const status = await UserLogin(uniIdInput, passwordInput);
    if (status === true) {
      const fetchStatus = await FetchAndSaveUserDataByUniId(uniIdInput);
      if (fetchStatus === true) {
        const localData = await GetOfflineUserData();
        if (localData) {
          localData.userType === "Teacher" ? navigate("/Home") : setErrorMessage(t("students-not-allowed"));
        }
      } else {
        setErrorMessage(t(String(fetchStatus)));
      }
    } else {
      setErrorMessage(t(String(status)));
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="md:w-xl" />
          <div className="flex flex-col gap-3.5">
            <TextBox
              icon="person-icon"
              label={"Uni-ID"}
              value={uniIdInput}
              onChange={setUniIdInput}
              autofocus={true}
            />
            <TextBox
              icon="lock-icon"
              label={t("password")}
              value={passwordInput}
              onChange={setPasswordInput}
              isPassword={true}
            />
            {errorMessage && <ErrorMessage text={errorMessage} />}
            {successMessage && <SuccessMessage text={t(successMessage)} />}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-end pr-2">
                <NormalLink text={t("forgot-password")} onClick={() => navigate("/PasswordRecovery")} />
              </div>
              <NormalButton text={"Log in"} onClick={handleLogin} />
              <div className="flex flex-col gap-4">
                <NormalLink text={t("register-now")} onClick={() => navigate("/CreateAccount")} />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginView;
