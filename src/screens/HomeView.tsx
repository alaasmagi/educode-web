import { useEffect, useState } from "react";
import "../App.css";
import DataField from "../components/DataField";
import NormalLink from "../components/Link";
import NormalButton from "../components/NormalButton";
import SuccessMessage from "../components/SuccessMessage";
import TextBox from "../components/TextBox";
import QuickNavigation from "../layout/QuickNavigation";
import SideBar from "../layout/SideBar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GetCurrentAttendance } from "../businesslogic/CourseAttendanceData";
import LocalUserData from "../models/LocalUserDataModel";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import AttendanceModel from "../models/AttendanceModel";
import NormalMessage from "../components/NormalMessage";
import ErrorMessage from "../components/ErrorMessage";

function HomeView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [currentAttendanceData, setCurrentAttendanceData] =
    useState<AttendanceModel | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchCurrentAttdencance();
  });

  const fetchCurrentAttdencance = async () => {
    const status = localData
      ? await GetCurrentAttendance(String(localData.uniId))
      : t("local-data-not-found");
    if (typeof status === "string") {
      setNormalMessage(status);
    } else {
      setCurrentAttendanceData(status);
    }
  };

  const fetchUserData = async () => {
    const localUserData = await GetOfflineUserData();
    setLocalData(localUserData);
  };

  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
            <span className="text-2xl font-bold self-start">
              {t("ongoing-attendance") + ":"}
            </span>
            {currentAttendanceData && (
              <div className="flex flex-col gap-2 items-start">
                <DataField
                  fieldName={t("course-name")}
                  data={"Kasutajaliidesed"}
                />
                <DataField fieldName={t("course-code")} data={"ITI0209"} />
                <DataField fieldName={t("no-of-students")} data={"25"} />
                <NormalLink
                  text={t("view-attendance-details")}
                  onClick={() => navigate("/Attendances")}
                />
              </div>
            )}
            <div className="py-4 flex justify-center">
              {successMessage && <SuccessMessage text={t(successMessage)} />}
              {normalMessage && <NormalMessage text={t(normalMessage)} />}
              {errorMessage && <ErrorMessage text={t(errorMessage)} />}
            </div>
            {currentAttendanceData && (
              <div className="flex flex-col w-9/12 self-center items-center gap-3">
                <TextBox icon="person-icon" placeHolder={t("student-code")} />
                <NormalButton text={t("add-student")} onClick={console.log} />
              </div>
            )}
          </div>
          <QuickNavigation
            quickNavItemA={{
              label: t("add-new-attendance"),
              onClick: () => navigate("/Attendances"),
            }}
            quickNavItemB={{
              label: t("view-recent-attendance"),
              onClick: () => navigate("/Attendances"),
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HomeView;
