import "../App.css";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox";
import NormalLink from "../components/Link";
import ErrorMessage from "../components/ErrorMessage";
import { useState } from "react";
import { dismissKeyboard } from "../hooks/DismissKeyboard";
import {
  FetchAndSaveUserDataByUniId,
  UserLogin,
} from "../businesslogic/UserDataOnline";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";

function LoginView() {
  const [uniIdInput, setUniIdInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    dismissKeyboard();
    if (await UserLogin(uniIdInput, passwordInput)) {
      const loginStatus = await FetchAndSaveUserDataByUniId(uniIdInput);
      if (loginStatus) {
        const localData = await GetOfflineUserData();
        if (localData) {
          localData.userType === "Teacher"
            ? navigate("/Home")
            : setErrorMessage(
                "Students can't log in. Please use the mobile app."
              );
        }
      } else {
        setErrorMessage("login-error");
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } else {
      setErrorMessage("login-error");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="md:w-xl" />
          <div className="flex flex-col gap-3.5">
            <TextBox
              icon="person-icon"
              placeHolder={"UniID"}
              value={uniIdInput}
              onChange={setUniIdInput}
            />
            <TextBox
              icon="lock-icon"
              placeHolder={"Password"}
              value={passwordInput}
              onChange={setPasswordInput}
              isPassword={true}
            />
            {errorMessage && <ErrorMessage text={errorMessage} />}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-end pr-2">
                <NormalLink
                  text="Forgot password?"
                  onClick={() => console.log("LINK PRESSED")}
                />
              </div>
              <NormalButton text={"Log in"} onClick={handleLogin} />
              <NormalLink
                text={"No account? Create one!"}
                onClick={() => console.log("LINK PRESSED")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginView;
