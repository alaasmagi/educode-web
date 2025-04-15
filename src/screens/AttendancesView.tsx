import { use, useEffect, useState } from "react";
import "../App.css";
import ContainerCardLarge from "../components/ContainerCardLarge";
import NormalLink from "../components/Link";
import TextBox from "../components/TextBox";
import SideBar from "../layout/SideBar";
import NormalButton from "../components/NormalButton";
import DropDownList from "../components/DropdownList";
import DataField from "../components/DataField";
import QuickNavigation from "../layout/QuickNavigation";
import { useNavigate, useParams } from "react-router-dom";
import SuccessMessage from "../components/SuccessMessage";
import { useTranslation } from "react-i18next";
import DateSelector from "../components/DateSelector";
import TimeSelector from "../components/TimeSelector";
import DetailedDataField from "../components/DetailedDataField";
import QrGenerator from "../components/QrGenerator";
import { Icons } from "../components/Icons";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import {
  AddAttendanceCheck,
  AddAttendances,
  DeleteAttendance,
  DeleteAttendanceCheck,
  GetAttendanceById,
  GetAttendanceChecksByAttendanceId,
  GetAttendancesByCourseCode,
  GetAttendanceTypes,
  GetStudentCountByAttendanceId,
} from "../businesslogic/AttendanceDataFetch";
import LocalUserData from "../models/LocalUserDataModel";
import {
  CourseAttendance,
  MultipleCourseAttendances,
} from "../models/CourseAttendanceModel";
import ToSixDigit from "../helpers/NumberConverter";
import { GetCoursesByUser } from "../businesslogic/CourseDataFetch";
import Course from "../models/CourseModel";
import AttendanceType from "../models/AttendanceTypeModel";
import NormalMessage from "../components/NormalMessage";
import ErrorMessage from "../components/ErrorMessage";
import { FormatDateOnlyToBackendFormat } from "../helpers/DateHandlers";
import GetSixDigitTimeStamp from "../helpers/TimeStamp";
import AttendanceCheckData from "../models/AttendanceCheckModel";
import { RegexFilters } from "../helpers/RegexFilters";
import PDFDocument from "../components/PDFDocument";
import { PDFViewer } from "@react-pdf/renderer";
import AttendanceCheckModel from "../models/AttendanceCheckModel";

function AttendancesView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, attendanceId } = useParams();
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [studentCount, setStudentCount] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<CourseAttendance | null>(
    null
  );
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [studentCodeInput, setStudentCodeInput] = useState<string>("");
  const [firstNameInput, setFirstNameInput] = useState<string>("");
  const [lastNameInput, setLastNameInput] = useState<string>("");
  const [workplaceInput, setWorkplaceInput] = useState<string>("");

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAttendanceTypeId, setSelectedAttendanceTypeId] = useState<
    string | null
  >(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [dates, setDates] = useState([{ id: 1, date: "" }]);
  const [date, setDate] = useState<string | null>(null);

  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(
    null
  );
  const [courseAttendances, setCourseAttendances] = useState<
    CourseAttendance[] | null
  >(null);
  const [availableAttendanceTypes, setAvailableAttendanceTypes] = useState<
    AttendanceType[] | null
  >(null);
  const [attendanceChecks, setAttendanceChecks] = useState<
    AttendanceCheckData[] | null
  >(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
    if (status) {
      setNavState(status);
    } else {
      setNavState("Main");
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      switch (navState) {
        case "Main":
          fetchAllAttendances();
          break;
        case "Details":
          fetchAttendanceDetails();
          break;
        case "Create":
          fetchAllCoursesByUser();
          fetchAttendanceTypes();
          break;
        case "Students":
          fetchAllAttendanceChecksByAttendance();
          break;
        default:
          break;
      }
      setTimeout(() => setErrorMessage(null), 3000);
      setTimeout(() => setNormalMessage(null), 3000);
    };

    fetchData();
  }, [navState, attendanceId]);

  useEffect(() => {
    if (!attendanceId) return;

    const interval = setInterval(() => {
      setQrValue(generateQrValue());
    }, 7000);

    return () => clearInterval(interval);
  }, [attendanceId]);

  const fetchAttendanceDetails = async () => {
    if (attendanceId) {
      const status = await GetAttendanceById(Number(attendanceId));
      if (typeof status === "string") {
        setErrorMessage(status);
      } else {
        setAttendanceData(status);
        setSelectedAttendanceTypeId(status.attendanceTypeId);
        setSelectedCourseId(String(status.courseId));
        setStartTime(String(status.startTime));
        setEndTime(String(status.endTime));
        setDate(String(status.date));

        const studentStatus = await GetStudentCountByAttendanceId(
          Number(attendanceId)
        );

        if (typeof status === "string") {
          setErrorMessage(t(String(studentStatus)));
          setStudentCount("0");
        } else {
          setStudentCount(String(studentStatus));
        }
      }
      setTimeout(() => setErrorMessage(null), 3000);
      setTimeout(() => setNormalMessage(null), 3000);
    }
  };

  const fetchAllAttendanceChecksByAttendance = async () => {
    const status = await GetAttendanceChecksByAttendanceId(
      Number(attendanceId)
    );

    if (typeof status === "string") {
      setNormalMessage(t("no-students-in-this-attendance"));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setAttendanceChecks(status);
    }
  };

  const fetchAllAttendances = async () => {
    const localData = await GetOfflineUserData();
    const courses = await GetCoursesByUser(localData?.uniId!);
    let attendances: CourseAttendance[] = [];
    if (typeof courses === "string") {
      setNormalMessage("no-course-attendances-found");
      return;
    }
    for (const course of courses) {
      const response = await GetAttendancesByCourseCode(course.courseCode);
      if (typeof response !== "string") {
        attendances.push(...response);
      } else {
        setNormalMessage(response);
      }
    }
    setCourseAttendances(attendances);
  };

  const fetchAllCoursesByUser = async () => {
    const userData = await GetOfflineUserData();
    const response = await GetCoursesByUser(userData?.uniId!);
    if (typeof response !== "string") {
      setAvailableCourses(response);
    }
  };
  const fetchUserData = async () => {
    const userData = await GetOfflineUserData();
    if (userData == null) {
      navigate("/");
      return;
    }
    setLocalData(userData);
  };
  const fetchAttendanceTypes = async () => {
    const response = await GetAttendanceTypes();

    if (typeof response === "string") {
      setErrorMessage(t(response));
    } else {
      setAvailableAttendanceTypes(response);
    }
  };

  const deleteAttendanceCheck = async (attendanceCheckId: number) => {
    const status = await DeleteAttendanceCheck(attendanceCheckId);

    if (typeof status === "string") {
      setErrorMessage(t(String(status)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(t("student-remove-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setNavState("Students");
    }
  };

  const validateForm = () => {
    if (
      !selectedCourseId ||
      !selectedAttendanceTypeId ||
      !startTime ||
      !endTime
    ) {
      setNormalMessage(t("all-fields-required-message"));
      setTimeout(() => setNormalMessage(null), 3000);
      return false;
    }
    return true;
  };
  const handleAttendanceAdd = async () => {
    if (!validateForm()) return;

    const attendanceData: MultipleCourseAttendances = {
      courseId: Number(selectedCourseId),
      attendanceTypeId: String(selectedAttendanceTypeId),
      startTime: String(startTime),
      endTime: String(endTime),
      dates: dates.map((entry) => FormatDateOnlyToBackendFormat(entry.date)),
    };
    const result = await AddAttendances(attendanceData);

    if (typeof result === "string") {
      setErrorMessage(t(String(result)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSelectedCourseId(null);
      setSelectedAttendanceTypeId(null);
      setStartTime(null);
      setStartTime(null);
      setDates([]);
      setSuccessMessage(t("attendance-add-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
    }
  };

  const handleAttendanceDelete = async () => {
    const status = DeleteAttendance(Number(attendanceId));

    if (typeof status === "string") {
      setErrorMessage(t(String(status)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(t("attendance-delete-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => navigate(`/Attendances`), 3000);
    }
  };

  const handleAddAttendanceCheck = async () => {
    let response;
    if (workplaceInput !== "" && !RegexFilters.defaultId.test(workplaceInput)) {
      setErrorMessage(t("wrong-workplace-id"));
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    } else {
      const model: AttendanceCheckModel = {
        studentCode: studentCodeInput,
        fullName: `${firstNameInput} ${lastNameInput}`,
        courseAttendanceId: attendanceData!.attendanceId!,
        workplaceId: parseInt(workplaceInput) ?? null,
      };
      response = await AddAttendanceCheck(model);
    }

    if (typeof response === "string") {
      setErrorMessage(t(String(response)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(
        t("attendance-check-add-success") + `${studentCodeInput}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setStudentCodeInput("");
    setFirstNameInput("");
    setLastNameInput("");
    setWorkplaceInput("");
  };

  function generateQrValue() {
    return `${ToSixDigit(Number(attendanceId))}-${ToSixDigit(
      GetSixDigitTimeStamp()
    )}`;
  }

  const addDateField = () => {
    setDates([...dates, { id: Date.now(), date: "" }]);
  };
  const removeDateField = (id: number) => {
    setDates(dates.filter((entry) => entry.id !== id));
  };
  const updateDateField = (id: number, newDate: string) => {
    setDates((prevDates) =>
      prevDates.map((entry) =>
        entry.id === id ? { ...entry, date: newDate } : entry
      )
    );
  };

  return (
    <>
      <SideBar />
      <div className="flex max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          {navState === "Main" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <span className="text-2xl font-bold self-start">
                {t("all-attendances")}
              </span>
              {courseAttendances?.map((attendance) => (
                <ContainerCardLarge
                  key={attendance.attendanceId}
                  boldLabelA={String(attendance.courseName)}
                  boldLabelB={`(${String(attendance.courseCode)})`}
                  extraData={{
                    fieldName: t("date-time"),
                    data: String(attendance.date),
                  }}
                  linkText={t("view-details")}
                  onClick={() =>
                    navigate(`/Attendances/Details/${attendance.attendanceId}`)
                  }
                />
              ))}
              {normalMessage && (
                <div className="flex self-center">
                  <NormalMessage text={t(normalMessage)} />
                </div>
              )}
              <NormalLink
                text={t("add-new-attendance")}
                onClick={() => setNavState("Create")}
              />
            </div>
          )}
          {navState === "Create" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {t("add-attendance")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <DropDownList
                  icon="school-icon"
                  options={
                    availableCourses?.map((course) => ({
                      label: course.courseName,
                      value: String(course.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  label={t("course")}
                />
                <DropDownList
                  icon="attendance-type-icon"
                  options={
                    availableAttendanceTypes?.map((type) => ({
                      label: t(type.attendanceType),
                      value: String(type.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedAttendanceTypeId(e.target.value)}
                  label={t("attendance-type")}
                />
                <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs gap-4">
                  <div className="flex flex-col items-start">
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {t("start-time") + ": "}
                      </span>
                      <TimeSelector
                        value={String(startTime)}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {t("end-time") + ": "}
                      </span>
                      <TimeSelector
                        value={String(endTime)}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xl mr-2 font-semibold self-start">
                  {t("dates") + ": "}
                </span>
                <div className="flex flex-col">
                  {dates.map((entry) => (
                    <div key={entry.id} className="flex flex-row gap-0">
                      <DateSelector
                        value={entry.date}
                        onChange={(e) =>
                          updateDateField(entry.id, e.target.value)
                        }
                      />
                      {dates.length > 1 && (
                        <NormalLink
                          text={t("remove")}
                          onClick={() => removeDateField(entry.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <NormalLink text={t("add-more-dates")} onClick={addDateField} />
                <div className="py-4">
                  {successMessage && (
                    <SuccessMessage text={t(successMessage)} />
                  )}
                  {normalMessage && <NormalMessage text={t(normalMessage)} />}
                  {errorMessage && <ErrorMessage text={t(errorMessage)} />}
                </div>
                <NormalButton
                  text={t("add-attendance")}
                  onClick={handleAttendanceAdd}
                />
              </div>
            </div>
          )}
          {navState === "Details" && (
            <>
              <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
                <span className="text-2xl font-bold self-start">
                  {t("attendance-details")}
                </span>
                <div>
                  <DataField
                    fieldName={t("course-name")}
                    data={String(attendanceData?.courseName)}
                  />
                  <DataField
                    fieldName={t("course-code")}
                    data={String(attendanceData?.courseCode)}
                  />
                  <DataField
                    fieldName={t("attendance-type")}
                    data={t(String(attendanceData?.attendanceType))}
                  />
                  <DataField
                    fieldName={t("date")}
                    data={String(attendanceData?.date)}
                  />
                  <DataField
                    fieldName={t("start-time")}
                    data={String(attendanceData?.startTime)}
                  />
                  <DataField
                    fieldName={t("end-time")}
                    data={String(attendanceData?.endTime)}
                  />
                  <DataField
                    fieldName="ID"
                    data={ToSixDigit(Number(attendanceData?.attendanceId))}
                  />
                  <div className="flex flex-col items-start mt-3">
                    <NormalLink
                      text={t("view-students")}
                      onClick={() => setNavState("Students")}
                    />
                    <NormalLink
                      text={t("view-qr")}
                      onClick={() => setNavState("QR")}
                    />
                  </div>
                </div>
                {successMessage && (
                  <div className="flex justify-center">
                    <SuccessMessage text={t(successMessage)} />
                  </div>
                )}
                {normalMessage && (
                  <div className="flex justify-center">
                    <NormalMessage text={t(normalMessage)} />
                  </div>
                )}
                {errorMessage && (
                  <div className="flex justify-center">
                    <ErrorMessage text={t(errorMessage)} />
                  </div>
                )}

                {attendanceData && (
                  <div className="flex flex-col md:w-7/12 max-md:w-11/12 self-center items-center gap-3">
                    <TextBox
                      icon="person-icon"
                      label={t("student-code")}
                      placeHolder={t("for-example-abbr") + " 123456ABCD"}
                      value={studentCodeInput}
                      autofocus={true}
                      onChange={setStudentCodeInput}
                    />
                     <TextBox
                      icon="person-icon"
                      label={t("first-name")}
                      value={firstNameInput}
                      autofocus={true}
                      onChange={setFirstNameInput}
                    />
                     <TextBox
                      icon="person-icon"
                      label={t("last-name")}
                      value={lastNameInput}
                      autofocus={true}
                      onChange={setLastNameInput}
                    />
                    <TextBox
                      icon="work-icon"
                      label={t("workplace-id")}
                      placeHolder={t("for-example-abbr") + " 123456"}
                      value={workplaceInput}
                      onChange={setWorkplaceInput}
                    />
                    <NormalButton
                      text={t("add-student")}
                      onClick={handleAddAttendanceCheck}
                      isDisabled={
                        !RegexFilters.studentCode.test(studentCodeInput)
                      }
                    />
                  </div>
                )}
                <div className="flex justify-between">
                  <NormalLink
                    text={t("go-back")}
                    onClick={() => navigate(-1)}
                  />
                  <NormalLink
                    text={t("delete-attendance")}
                    onClick={handleAttendanceDelete}
                  />
                </div>
              </div>
              <QuickNavigation
                quickNavItemA={{
                  label: t("add-new-attendance"),
                  onClick: () => navigate("/Attendance/Create"),
                }}
                quickNavItemB={{
                  label: t("view-statistics"),
                  onClick: () => navigate("/Statistics"),
                }}
              />
            </>
          )}
          {navState === "Students" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {t("students-in-this-attendance")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                {attendanceChecks?.map((attendanceCheck) => (
                  <div className="flex flex-row gap-5 justify-between w-full">
                    <DetailedDataField
                      dataA= {attendanceCheck.fullName}
                      dataB={attendanceCheck.studentCode}
                    />
                    <NormalLink
                      text={t("remove")}
                      onClick={() => deleteAttendanceCheck(Number(attendanceCheck.id))}
                    />
                  </div>
                ))}
              </div>
              {successMessage && (
                <div className="flex self-center">
                  <SuccessMessage text={successMessage} />
                </div>
              )}
              {normalMessage && (
                <div className="flex self-center">
                  <NormalMessage text={normalMessage} />
                </div>
              )}
              {errorMessage && (
                <div className="flex self-center">
                  <ErrorMessage text={t(errorMessage)} />
                </div>
              )}
              <div className="flex justify-between">
                <NormalLink
                  text={t("go-back")}
                  onClick={() => {
                    setNavState("Details");
                  }}
                />
                <NormalLink
                  text={t("view-as-pdf")}
                  onClick={() => navigate(`/Attendances/PDF/`)}
                />
              </div>
            </div>
          )}
          {navState === "QR" && (
            <div className="flex flex-col max-md:w-90 md:max-w-6xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="md:text-5xl max-md:text-2xl font-bold self-center">
                {t("qr-of-this-attendance")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <QrGenerator value={qrValue} />
                <div className="flex flex-row gap-5 justify-items-center">
                  <img src={Icons["key-icon"]} className="md:h-13 max-md:h-8" />
                  <span className="md:text-5xl max-md:text-2xl font-bold">
                    {ToSixDigit(parseInt(attendanceId!)) +
                      "-" +
                      String(ToSixDigit(GetSixDigitTimeStamp()))}
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <NormalLink text={t("go-back")} onClick={() => navigate(-1)} />
              </div>
            </div>
          )}
          {navState === "PDF" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {t("students-in-this-attendance")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center w-full">
                {attendanceChecks && attendanceData && (
                  <PDFViewer className="w-full h-170">
                    <PDFDocument
                      attendanceData={attendanceData}
                      attendanceChecks={attendanceChecks}
                    />
                  </PDFViewer>
                )}
              </div>
              <div className="flex justify-center">
                <NormalLink text={t("go-back")} onClick={() => navigate(-1)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AttendancesView;
