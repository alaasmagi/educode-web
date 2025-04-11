import "../App.css";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox";
import NormalLink from "../components/Link";
import ErrorMessage from "../components/ErrorMessage";
import { useCallback, useEffect, useState } from "react";
import { dismissKeyboard } from "../hooks/DismissKeyboard";
import { FetchAndSaveUserDataByUniId, UserLogin } from "../businesslogic/UserDataFetch";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../components/LanguageSwitch";
import { RegexFilters } from "../helpers/RegexFilters";
import NormalMessage from "../components/NormalMessage";
import VerifyOTPModel from "../models/VerifyOTPModel";

function CreateAccountView() {
  const [stepNr, setStepNr] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uniIdInput, setUniIdInput] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const showTemporaryError = useCallback((message: string) => {
    setErrorMessage(message);
    const timeout = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const isNameFormValid = () => firstName !== "" && lastName !== "";
  const isStudentIDFormValid = () => RegexFilters.uniId.test(uniId);
  const isPasswordFormValid = () => password.length >= 8 && password === passwordAgain;

  useEffect(() => {
    setNormalMessage(!isNameFormValid() ? t("all-fields-required-message") : "");
  }, [firstName, lastName]);

  useEffect(() => {
    setNormalMessage(!isStudentIDFormValid() ? t("all-fields-required-message") : "");
  }, [uniIdInput]);

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
    const status = await Req(uniIdInput, firstName + lastName);
    if (status === true) {
      setStepNr(3);
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [uniIdInput, firstName, lastName, t, showTemporaryError]);

  const handleOTPVerification = useCallback(async () => {
    const otpData: VerifyOTPModel = { uniIdInput, otp: emailCode };
    const status = await VerifyOTP(otpData);
    if (status === true) {
      setStepNr(4);
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [uniId, emailCode, t, showTemporaryError]);

  const handleRegister = useCallback(async () => {
    const userData: CreateUserModel = {
      uniIdInput,
      fullName: `${firstName} ${lastName}`,
      password,
    };
    const status = await CreateAccountView(userData);
    if (status === true) {
      navigate("LoginView", { successMessage: t("create-account-success") });
    } else {
      showTemporaryError(t(String(status)));
    }
  }, [uniIdInput, firstName, lastName, password, navigate, t, showTemporaryError]);


  const renderStep = () => {
    const sharedMessage =  normalMessage || errorMessage;
    const messageComponent = errorMessage ? (
      <ErrorMessage text={errorMessage} />
    ) : (
      <NormalMessage text={normalMessage ?? ""} />
    );

    switch (stepNr) {
      case 1:
        return (
          <>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="person-icon"
                  placeHolder={t("first-name")}
                  value={firstName}
                  onChangeText={(text) => setFirstName(text.trim())}
                />
                <TextBox
                  iconName="person-icon"
                  placeHolder={t("last-name")}
                  value={lastName}
                  onChangeText={(text) => setLastName(text.trim())}
                />
              </View>
              {sharedMessage && <View style={styles.errorContainer}>{messageComponent}</View>}
            </View>
            <View style={styles.buttonContainer}>
              <NormalButton text={t("continue")} onPress={() => setStepNr(2)} disabled={!isNameFormValid()} />
              <NormalLink text={t("already-registered")} onPress={() => navigation.navigate("LoginView")} />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="person-icon"
                  placeHolder="Uni-ID"
                  autoCapitalize="none"
                  value={uniId}
                  onChangeText={(text) => setUniId(text.trim())}
                />
                <TextBox
                  iconName="person-icon"
                  placeHolder={t("student-code")}
                  autoCapitalize="characters"
                  value={studentCode}
                  onChangeText={(text) => setStudentCode(text.trim())}
                />
              </View>
              {sharedMessage && <View style={styles.errorContainer}>{messageComponent}</View>}
            </View>
            <View style={styles.buttonContainer}>
              <NormalLink text={t("something-wrong-back")} onPress={() => setStepNr(1)} />
              <NormalButton text={t("continue")} onPress={handleOTPRequest} disabled={!isStudentIDFormValid()} />
              <NormalLink text={t("already-registered")} onPress={() => navigation.navigate("LoginView")} />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.textBoxContainer}>
              <UnderlineText text={`${t("one-time-key-prompt")} ${uniId}@taltech.ee`} />
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="pincode-icon"
                  placeHolder={t("one-time-key")}
                  value={emailCode}
                  onChangeText={(text) => setEmailCode(text.trim())}
                />
              </View>
              {sharedMessage && <View style={styles.errorContainer}>{messageComponent}</View>}
            </View>
            <View style={styles.buttonContainer}>
              <NormalButton
                text={t("continue")}
                onPress={handleOTPVerification}
                disabled={!RegexFilters.defaultId.test(emailCode)}
              />
              {!isKeyboardVisible && <NormalLink text={t("something-wrong-back")} onPress={() => setStepNr(2)} />}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <View style={styles.textBoxContainer}>
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="lock-icon"
                  placeHolder={t("password")}
                  isPassword
                  value={password}
                  onChangeText={(text) => setPassword(text.trim())}
                />
                <TextBox
                  iconName="lock-icon"
                  placeHolder={t("repeat-password")}
                  isPassword
                  value={passwordAgain}
                  onChangeText={(text) => setPasswordAgain(text.trim())}
                />
              </View>
              {sharedMessage && <View style={styles.errorContainer}>{messageComponent}</View>}
            </View>
            <View style={styles.buttonContainer}>
              <NormalLink text={t("something-wrong-back")} onPress={() => setStepNr(3)} />
              <NormalButton text={t("continue")} onPress={() => setStepNr(5)} disabled={!isPasswordFormValid()} />
              <NormalLink text={t("already-registered")} onPress={() => navigation.navigate("LoginView")} />
            </View>
          </>
        );
      case 5:
        return (
          <>
            <View style={styles.textBoxContainer}>
              <UnderlineText text={t("verify-details")} />
              <View style={styles.data}>
                <DataText iconName="person-icon" text={`${firstName} ${lastName}`} />
                <DataText iconName="person-icon" text={uniId} />
                <DataText iconName="person-icon" text={studentCode} />
              </View>
              {sharedMessage && <View style={styles.errorContainer}>{messageComponent}</View>}
            </View>
            <View style={styles.buttonContainer}>
              <NormalLink text={t("something-wrong-back")} onPress={() => setStepNr(4)} />
              <NormalButton text={t("create-account")} onPress={handleRegister} />
              <NormalLink text={t("already-registered")} onPress={() => navigation.navigate("LoginView")} />
            </View>
          </>
        );
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
                autofocus={true}
              />
              <TextBox
                icon="lock-icon"
                placeHolder={t("password")}
                value={passwordInput}
                onChange={setPasswordInput}
                isPassword={true}
              />
              {errorMessage && <ErrorMessage text={errorMessage} />}
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-end pr-2">
                  <NormalLink text={t("forgot-password")} onClick={() => console.log("LINK PRESSED")} />
                </div>
                <NormalButton text={"Log in"} onClick={handleLogin} />
                <div className="flex flex-col gap-4">
                  <NormalLink text={t("register-now")} onClick={() => console.log("LINK PRESSED")} />
                  <LanguageSwitch linkStyle={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
}
export default CreateAccountView;
