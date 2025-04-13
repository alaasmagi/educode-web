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

function SettingsView() {
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
  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
            <span className="text-2xl font-bold self-start">
              {t("settings")}
            </span>
  
            <div className="py-4 flex justify-center">
              {successMessage && <SuccessMessage text={t(successMessage)} />}
              {normalMessage && <NormalMessage text={t(normalMessage)} />}
              {errorMessage && <ErrorMessage text={t(errorMessage)} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SettingsView;
