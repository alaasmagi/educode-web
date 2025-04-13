import "../App.css";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox";
import NormalLink from "../components/Link";
import ErrorMessage from "../components/ErrorMessage";
import { useCallback, useEffect, useState } from "react";
import {
  CreateUserAccount,
  RequestOTP,
  VerifyOTP,
} from "../businesslogic/UserDataFetch";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../components/LanguageSwitch";
import { RegexFilters } from "../helpers/RegexFilters";
import NormalMessage from "../components/NormalMessage";
import VerifyOTPModel from "../models/VerifyOTPModel";
import CreateUserModel from "../models/CreateUserModel";
import UnderlineText from "../components/UnderlineText";
import DataText from "../components/DataText";

function CreateAccountView() {
  const [stepNr, setStepNr] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uniIdInput, setUniIdInput] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>("null");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const showTemporaryError = useCallback((message: string) => {
    setErrorMessage(message);
    const timeout = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const isNameFormValid = () => firstName !== "" && lastName !== "";
  const isPasswordFormValid = () =>
    password.length >= 8 && password === passwordAgain;

  useEffect(() => {
    setNormalMessage(
      !isNameFormValid() ? t("all-fields-required-message") : ""
    );
  }, [firstName, lastName]);

  useEffect(() => {
    if (password.length < 8 && password !== "") {
      setNormalMessage(t("password-length-message"));
    } else if (!isPasswordFormValid() && password && passwordAgain) {
      setNormalMessage(t("password-match-message"));
    } else {
      setNormalMessage("");
    }
  }, [password, passwordAgain]);

  const handleOTPRequest = useCallback(async () => {
    const status = await RequestOTP(uniIdInput, firstName + lastName);
    if (status === true) {
      setStepNr(3);
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [uniIdInput, firstName, lastName, t, showTemporaryError]);

  const handleOTPVerification = useCallback(async () => {
    const otpData: VerifyOTPModel = { uniId: uniIdInput, otp: emailCode };
    const status = await VerifyOTP(otpData);
    if (status === true) {
      setStepNr(4);
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [uniIdInput, emailCode, t, showTemporaryError]);

  const handleRegister = useCallback(async () => {
    const userData: CreateUserModel = {
      uniId: uniIdInput,
      fullName: `${firstName} ${lastName}`,
      password,
    };
    const status = await CreateUserAccount(userData);
    if (typeof status !== "string") {
      navigate("/Login/create-account-success");
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [
    uniIdInput,
    firstName,
    lastName,
    password,
    navigate,
    t,
    showTemporaryError,
  ]);

  const renderStep = () => {
    const sharedMessage = normalMessage || errorMessage;
    const messageComponent = errorMessage ? (
      <ErrorMessage text={errorMessage} />
    ) : (
      <NormalMessage text={normalMessage ?? ""} />
    );

    switch (stepNr) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-10">
              <div className="flex min-w-2xs flex-col gap-5">
                <TextBox
                  icon="person-icon"
                  placeHolder={t("first-name")}
                  value={firstName}
                  onChange={(text) => setFirstName(text.trim())}
                />
                <TextBox
                  icon="person-icon"
                  placeHolder={t("last-name")}
                  value={lastName}
                  onChange={(text) => setLastName(text.trim())}
                />
              </div>
              {sharedMessage && <>{messageComponent}</>}
            </div>
            <div className="flex flex-col self-center justify-center ">
              <NormalButton
                text={t("continue")}
                onClick={() => setStepNr(2)}
                isDisabled={!isNameFormValid()}
              />
              <div className="flex flex-col gap-4">
                <NormalLink
                  text={t("already-registered")}
                  onClick={() => navigate("/Login")}
                />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-10">
              <div className="flex min-w-2xs flex-col gap-5">
                <TextBox
                  icon="person-icon"
                  placeHolder="Uni-ID"
                  value={uniIdInput ?? ""}
                  onChange={(text) => setUniIdInput(text.trim())}
                />
              </div>
              {sharedMessage && <>{messageComponent}</>}
            </div>
            <div className="flex flex-col self-center justify-center ">
              <NormalButton
                text={t("continue")}
                onClick={handleOTPRequest}
              />
              <div className="flex flex-col gap-4">
                <NormalLink
                  text={t("something-wrong-back")}
                  onClick={() => setStepNr(1)}
                />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex min-w-2xs flex-col gap-5">
              <UnderlineText
                text={`${t("one-time-key-prompt")} ${uniIdInput}@taltech.ee`}
              />
              <div>
                <TextBox
                  icon="pincode-icon"
                  placeHolder={t("one-time-key")}
                  value={emailCode}
                  onChange={(text) => setEmailCode(text.trim())}
                />
              </div>
              {sharedMessage && <>{messageComponent}</>}
            </div>
            <div className="flex flex-col self-center justify-center ">
              <NormalButton
                text={t("continue")}
                onClick={handleOTPVerification}
                isDisabled={!RegexFilters.defaultId.test(emailCode)}
              />
              <div className="flex flex-col gap-4">
                <NormalLink
                  text={t("something-wrong-back")}
                  onClick={() => setStepNr(2)}
                />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-10">
              <div className="flex min-w-2xs flex-col gap-5">
                <TextBox
                  icon="lock-icon"
                  placeHolder={t("password")}
                  isPassword
                  value={password}
                  onChange={(text) => setPassword(text.trim())}
                />
                <TextBox
                  icon="lock-icon"
                  placeHolder={t("repeat-password")}
                  isPassword
                  value={passwordAgain}
                  onChange={(text) => setPasswordAgain(text.trim())}
                />
              </div>
              {sharedMessage && <>{messageComponent}</>}
            </div>
            <div className="flex flex-col self-center justify-center ">
              <NormalButton
                text={t("continue")}
                onClick={() => setStepNr(5)}
                isDisabled={!isPasswordFormValid()}
              />
              <div className="flex flex-col gap-4">
                <NormalLink
                  text={t("something-wrong-back")}
                  onClick={() => setStepNr(3)}
                />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <>
            <div className="flex flex-col gap-5">
              <UnderlineText text={t("verify-details")} />
              <div className="flex flex-col gap-3 border-2 p-2 border-main-text rounded-2xl">
                <DataText
                  icon={"person-icon"}
                  text={`${firstName} ${lastName}`}
                />
                <DataText icon={"person-icon"} text={uniIdInput} />
              </div>
              {sharedMessage && <>{messageComponent}</>}
            </div>
            <div className="flex flex-col self-center justify-center ">
              <NormalButton
                text={t("create-account")}
                onClick={handleRegister}
              />
              <div className="flex flex-col gap-4">
                <NormalLink
                  text={t("something-wrong-back")}
                  onClick={() => setStepNr(4)}
                />
                <LanguageSwitch linkStyle={true} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="md:w-xl" />
          {renderStep()}
        </div>
      </div>
    </>
  );
}
export default CreateAccountView;
