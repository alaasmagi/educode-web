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
import {
  AddAttendanceCheck,
  GetCurrentAttendance,
  GetMostRecentAttendance,
  GetStudentCountByAttendanceId,
} from "../businesslogic/AttendanceDataFetch";
import LocalUserData from "../models/LocalUserDataModel";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import NormalMessage from "../components/NormalMessage";
import ErrorMessage from "../components/ErrorMessage";
import { RegexFilters } from "../helpers/RegexFilters";
import CreateAttendanceCheckModel from "../models/CreateAttendanceCheckModel";
import { CourseAttendance } from "../models/CourseAttendanceModel";

function HomeView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [currentStudentCount, setCurrentStudentCount] = useState<string | null>(null);
  const [currentAttendanceData, setCurrentAttendanceData] = useState<CourseAttendance | null>(null);

  const [studentCodeInput, setStudentCodeInput] = useState<string>("");
  const [workplaceInput, setWorkplaceInput] = useState<string>("");
  const [recentAttendanceId, setRecentAttendanceId] = useState<string>("");

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (localData != null) {
      fetchCurrentAttdencanceData();
      fetchMostRecentAttendace();
      const interval = setInterval(() => {
        fetchCurrentAttdencanceData();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [localData]);

  const fetchCurrentAttdencanceData = async () => {
    const status = localData != null ? await GetCurrentAttendance(String(localData.uniId)) : "Local data not found";
    if (typeof status === "string") {
      setCurrentAttendanceData(null);
    } else {
      const studentStatus = await GetStudentCountByAttendanceId(Number(status.attendanceId));

      if (typeof status === "string") {
        setErrorMessage(t(String(studentStatus)));
        setCurrentStudentCount("0");
      } else {
        setCurrentStudentCount(String(studentStatus));
        setCurrentAttendanceData(status);
      }
    }
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const fetchMostRecentAttendace = async () => {
    const status = localData != null ? await GetMostRecentAttendance(String(localData.uniId)) : "Local data not found";

    if (typeof status !== "string") {
      setRecentAttendanceId(String(status.attendanceId));
    }
  };

  const handleAddAttendanceCheck = async () => {
    let response;
    if (workplaceInput !== "" && !RegexFilters.defaultId.test(workplaceInput)) {
      setErrorMessage(t("wrong-workplace-id"));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      const model: CreateAttendanceCheckModel = {
        studentCode: studentCodeInput,
        courseAttendanceId: currentAttendanceData!.attendanceId!,
        workplaceId: parseInt(workplaceInput) ?? null,
      };
      response = await AddAttendanceCheck(model);
    }

    if (typeof response === "string") {
      setErrorMessage(t(String(response)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(t("attendance-check-add-success") + `${studentCodeInput}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setStudentCodeInput("");
    setWorkplaceInput("");
  };

  const fetchUserData = async () => {
    const userData = await GetOfflineUserData();
    setLocalData(userData);
  };

  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
            <span className="text-2xl font-bold self-start">{t("ongoing-attendance") + ":"}</span>
            {currentAttendanceData && (
              <div className="flex flex-col gap-2 items-start">
                <DataField fieldName={t("course-name")} data={currentAttendanceData.courseName} />
                <DataField fieldName={t("course-code")} data={currentAttendanceData.courseCode} />
                <DataField fieldName={t("no-of-students")} data={String(currentStudentCount)} />
                <NormalLink
                  text={t("view-attendance-details")}
                  onClick={() => navigate(`/Attendances/Details/${currentAttendanceData.attendanceId}`)}
                />
              </div>
            )}
            <div className="py-4 flex justify-center">
              {successMessage && <SuccessMessage text={t(successMessage)} />}
              {normalMessage && <NormalMessage text={t(normalMessage)} />}
              {errorMessage && <ErrorMessage text={t(errorMessage)} />}
            </div>
            {currentAttendanceData && (
              <div className="flex flex-col md:w-7/12 max-md:w-11/12 self-center items-center gap-3">
                <TextBox
                  icon="person-icon"
                  placeHolder={t("student-code")}
                  value={studentCodeInput}
                  autofocus={true}
                  onChange={setStudentCodeInput}
                />
                <TextBox
                  icon="work-icon"
                  placeHolder={t("workplace-id")}
                  value={workplaceInput}
                  onChange={setWorkplaceInput}
                />
                <NormalButton
                  text={t("add-student")}
                  onClick={handleAddAttendanceCheck}
                  isDisabled={!RegexFilters.studentCode.test(studentCodeInput)}
                />
              </div>
            )}
          </div>
          <QuickNavigation
            quickNavItemA={{
              label: t("add-new-attendance"),
              onClick: () => navigate("/Attendances/Create"),
            }}
            quickNavItemB={{
              label: t("view-recent-attendance"),
              onClick: () =>
                recentAttendanceId ? navigate(`/Attendances/Details/${recentAttendanceId}`) : navigate("/Attendances"),
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HomeView;
