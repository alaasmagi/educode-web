import React, { useState, useEffect } from "react";
import NavigationProps from "../../types";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import globalStyles from "../styles/GlobalStyles";
import { useTranslation } from "react-i18next";
import NormalHeader from "../layout/NormalHeader";
import NormalButton from "../components/NormalButton";
import ModeToggle from "../components/ModeToggle";
import StepDivider from "../components/StepDivider";
import QrGenerator from "../components/QrGenerator";
import DataText from "../components/DataText";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import { GenerateQrString } from "../businesslogic/QrGenLogic";
import NormalLink from "../components/NormalLink";
import KeyboardVisibilityHandler from "../../hooks/KeyboardVisibilityHandler";
import UnderlineText from "../components/Link";
import { AddAttendanceCheck } from "../businesslogic/CourseAttendanceData";
import CreateAttendanceCheckModel from "../models/CreateAttendanceCheckModel";

function CompleteAttendanceView({ navigation, route }: NavigationProps) {
  const { localData, attendanceId, workplaceId = null } = route.params;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const isKeyboardVisible = KeyboardVisibilityHandler();
  let { stepNr } = route.params;
  stepNr++;
  const { t } = useTranslation();

  const [qrValue, setQrValue] = useState(
    GenerateQrString(localData.studentCode, attendanceId, workplaceId)
  );

  const refreshQrCode = () => {
    setQrValue(
      GenerateQrString(localData.studentCode, attendanceId, workplaceId)
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setQrValue(
        GenerateQrString(localData.studentCode, attendanceId, workplaceId)
      );
    }, 60000);

    return () => clearInterval(intervalId);
  }, [localData.studentCode, attendanceId, workplaceId]);

  const handleAttendanceCheckAdd = async () => {
    const attendanceCheck: CreateAttendanceCheckModel = {
      studentCode: localData.studentCode,
      courseAttendanceId: attendanceId,
      workplaceId: parseInt(workplaceId) ?? null,
    };
    const status = await AddAttendanceCheck(attendanceCheck);
    if (status) {
      setSuccessMessage(t("attendance-add-success"));
      setTimeout(() => {
        setSuccessMessage(null);
        navigation.navigate("StudentMainView", { localData });
      }, 3000);
    } else {
      setErrorMessage(t("attendance-check-add-fail"));
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={globalStyles.anrdoidSafeArea}>
        <View style={styles.headerContainer}>
          <NormalHeader navigation={navigation} route={route} />
        </View>
        <View style={styles.onlineToggleContainer}>
          <ModeToggle
            textLeft={t("offline-mode")}
            textRight={t("online-mode")}
            onPressLeft={() => setIsOnline(false)}
            onPressRight={() => setIsOnline(true)}
            isDisabled={localData.offlineOnly}
          />
        </View>
        {isOnline ? (
          <>
            <View style={styles.stepDividerContainer}>
              <StepDivider
                label={t("step-end-attendance")}
                stepNumber={stepNr}
              />
            </View>
            <UnderlineText text={t("verify-details")} />
            <View style={styles.data}>
              <DataText iconName="person-icon" text={localData.fullName} />
              <DataText iconName="key-icon" text={attendanceId} />
              <DataText
                iconName="work-icon"
                text={workplaceId ? workplaceId : t("no-workplace")}
              />
            </View>
            <View style={styles.messageContainer}>
              {successMessage && <SuccessMessage text={successMessage} />}
              {errorMessage && <ErrorMessage text={errorMessage} />}
            </View>
            <View style={styles.lowNavButtonContainer}>
              <NormalLink
                text={t("something-wrong-back")}
                onPress={() => {
                  navigation.navigate("StudentMainView", {
                    localData,
                    attendanceId,
                    workplaceId,
                    stepNr: stepNr - 1,
                  });
                }}
              />
              <NormalButton
                text={t("check-in")}
                onPress={handleAttendanceCheckAdd}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.stepDividerContainer}>
              <StepDivider label={t("step-show-qr")} stepNumber={stepNr} />
            </View>
            {!isKeyboardVisible && (
              <View style={styles.qrContainer}>
                <QrGenerator value={qrValue} />
              </View>
            )}
            <View style={styles.data}>
              <DataText iconName="person-icon" text={localData.studentCode} />
              <DataText iconName="key-icon" text={attendanceId} />
              <DataText
                iconName="work-icon"
                text={workplaceId ? workplaceId : t("no-workplace")}
              />
            </View>
            <View style={styles.lowNavButtonContainer}>
              <NormalLink
                text={t("something-wrong-back")}
                onPress={() => {
                  navigation.navigate("StudentMainView", {
                    localData,
                    attendanceId,
                    workplaceId,
                    stepNr: stepNr - 1,
                  });
                }}
              />
              <NormalButton text={t("refresh-qr")} onPress={refreshQrCode} />
            </View>
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1.5,
    justifyContent: "center",
  },
  onlineToggleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  stepDividerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dataContainer: {
    flex: 2,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  linkContainer: {
    paddingBottom: 4,
    alignSelf: "center",
    justifyContent: "flex-end",
  },
  lowNavButtonContainer: {
    flex: 1.5,
    gap: 4,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  data: {
    alignSelf: "center",
    width: "85%",
    borderWidth: 2,
    borderColor: "#BCBCBD",
    borderRadius: 20,
    gap: 10,
    padding: 10,
  },
});

export default CompleteAttendanceView;
