import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import NavigationProps from "../../types";
import globalStyles from "../styles/GlobalStyles";
import TextBox from "../components/TextBox";
import NormalButton from "../components/NormalButton";
import FormHeader from "../layout/FormHeader";
import Greeting from "../components/Greeting";
import NormalLink from "../components/NormalLink";
import {
  RequestOTP,
  VerifyOTP,
  ChangeUserPassword,
} from "../businesslogic/UserDataOnline";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardVisibilityHandler from "../../hooks/KeyboardVisibilityHandler";
import NormalMessage from "../components/NormalMessage";
import UnderlineText from "../components/Link";
import ChangePasswordModel from "../models/ChangePasswordModel";
import VerifyOTPModel from "../models/VerifyOTPModel";
import {
  preventScreenCaptureAsync,
  allowScreenCaptureAsync,
} from "expo-screen-capture";
import { RegexFilters } from "../helpers/RegexFilters";

function ForgotPasswordView({ navigation, route }: NavigationProps) {
  const isNormalPassChange: boolean =
    route?.params?.isNormalPassChange ?? false;
  const [uniId, setUniId] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);

  const { localData } = route.params ?? {};
  const { t } = useTranslation();
  const isKeyboardVisible = KeyboardVisibilityHandler();
  const [stepNr, setStepNr] = useState(1);

  useEffect(() => {
    preventScreenCaptureAsync();

    return () => {
      allowScreenCaptureAsync();
    };
  }, []);

  const isStudentIDFormValid = () => RegexFilters.uniId.test(uniId);
  useEffect(() => {
    if (!isStudentIDFormValid()) {
      setNormalMessage(t("all-fields-required-message"));
    } else {
      setNormalMessage("");
    }
  }, [uniId]);

  const isPasswordFormValid = () =>
    password.length >= 8 && password === passwordAgain;
  useEffect(() => {
    if (password.length < 8 && password !== "") {
      setNormalMessage(t("password-length-message"));
    } else if (
      !isPasswordFormValid() &&
      password !== "" &&
      passwordAgain !== ""
    ) {
      setNormalMessage(t("password-match-message"));
    } else {
      setNormalMessage("");
    }
  }, [password, passwordAgain]);

  const handleOTPRequest = async () => {
    Keyboard.dismiss();

    if (await RequestOTP(uniId)) {
      setStepNr(2);
    } else {
      setErrorMessage(t("no-account-found"));
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleOTPVerification = async () => {
    Keyboard.dismiss();
    const otpData: VerifyOTPModel = {
      uniId: uniId,
      otp: emailCode,
    };

    if (await VerifyOTP(otpData)) {
      setStepNr(3);
    } else {
      setErrorMessage(t("wrong-otp"));
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handlePasswordChange = async () => {
    const model: ChangePasswordModel = {
      uniId: uniId,
      newPassword: password,
    };
    const status: boolean = await ChangeUserPassword(model);
    if (status) {
      const successMessage = t("password-change-success");
      isNormalPassChange
        ? navigation.navigate("SettingsView", { localData, successMessage })
        : navigation.navigate("LoginView", { successMessage });
    } else {
      setErrorMessage(t("account-create-error"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={globalStyles.anrdoidSafeArea}>
        <View style={styles.headerContainer}>
          <FormHeader />
          {!isKeyboardVisible && (
            <Greeting
              text={
                isNormalPassChange ? t("change-password") : t("forgot-password")
              }
            />
          )}
        </View>
        {stepNr === 1 && (
          <>
            <View style={styles.textBoxContainer}>
              <UnderlineText text={t("verify-account")} />
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="person-icon"
                  placeHolder="Uni-ID *"
                  onChangeText={setUniId}
                  value={uniId}
                  autoCapitalize="none"
                />
              </View>
              {!isKeyboardVisible && errorMessage && (
                <View style={styles.errorContainer}>
                  <ErrorMessage text={errorMessage} />
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <NormalButton
                text={t("continue")}
                onPress={handleOTPRequest}
                disabled={uniId == ""}
              />
              <NormalLink
                text={isNormalPassChange ? t("dont-change-password") : t("")}
                onPress={() =>
                  isNormalPassChange
                    ? navigation.navigate("SettingsView", { localData })
                    : navigation.navigate("LoginView")
                }
              />
            </View>
          </>
        )}
        {stepNr === 2 && (
          <>
            <View style={styles.textBoxContainer}>
              <UnderlineText
                text={t("one-time-key-prompt") + ` ${uniId}@taltech.ee`}
              />
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="pincode-icon"
                  placeHolder={t("one-time-key") + "*"}
                  onChangeText={setEmailCode}
                  value={emailCode}
                />
              </View>
              {!isKeyboardVisible && errorMessage && (
                <View style={styles.errorContainer}>
                  <ErrorMessage text={errorMessage} />
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <NormalButton
                text={t("continue")}
                onPress={handleOTPVerification}
                disabled={uniId == ""}
              />
              <NormalLink
                text={t("something-wrong-back")}
                onPress={() => {
                  setStepNr(1);
                }}
              />
            </View>
          </>
        )}
        {stepNr === 3 && (
          <>
            <View style={styles.textBoxContainer}>
              <UnderlineText text={t("set-new-password")}></UnderlineText>
              <View style={styles.textBoxes}>
                <TextBox
                  iconName="lock-icon"
                  placeHolder={t("password")}
                  isPassword
                  onChangeText={setPassword}
                  value={password}
                />
                <TextBox
                  iconName="lock-icon"
                  placeHolder={t("repeat-password")}
                  isPassword
                  onChangeText={setPasswordAgain}
                  value={passwordAgain}
                />
              </View>
              {!isKeyboardVisible && normalMessage && (
                <View style={styles.errorContainer}>
                  <NormalMessage text={normalMessage} />
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <NormalButton
                text={t("continue")}
                onPress={handlePasswordChange}
                disabled={!isPasswordFormValid()}
              />
              <NormalLink
                text={t("something-wrong-back")}
                onPress={() => {
                  setStepNr(2);
                }}
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 2.2,
    gap: 70,
    justifyContent: "flex-end",
  },
  textBoxContainer: {
    flex: 2,
    justifyContent: "center",
    gap: 20,
  },
  data: {
    alignSelf: "center",
    width: "80%",
    borderWidth: 2,
    borderColor: "#BCBCBD",
    borderRadius: 20,
    gap: 25,
    padding: 10,
  },
  textBoxes: {
    gap: 25,
    alignItems: "center",
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "90%",
  },
  errorContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1.1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ForgotPasswordView;
