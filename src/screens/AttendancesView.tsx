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
import IconButton from "../components/IconButton";
import DetailedDataField from "../components/DetailedDataField";
import QrGenerator from "../components/QrGenerator";
import { Icons } from "../components/Icons";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import {
  AddAttendances,
  GetAttendanceById,
  GetAttendancesByCourseCode,
  GetAttendanceTypes,
  GetStudentCountByAttendanceId,
} from "../businesslogic/AttendanceDataFetch";
import LocalUserData from "../models/LocalUserDataModel";
import { CourseAttendance, MultipleCourseAttendances } from "../models/CourseAttendanceModel";
import ToSixDigit from "../helpers/NumberConverter";
import { GetCoursesByUser } from "../businesslogic/CourseDataFetch";
import Course from "../models/CourseModel";
import AttendanceType from "../models/AttendanceTypeModel";
import NormalMessage from "../components/NormalMessage";
import ErrorMessage from "../components/ErrorMessage";
import { FormatDateOnlyToBackendFormat } from "../helpers/DateHandlers";

function AttendancesView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, attendanceId } = useParams();
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [studentCount, setStudentCount] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<CourseAttendance | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [qrValue, setQrValue] = useState<string>("");

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAttendanceTypeId, setSelectedAttendanceTypeId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [dates, setDates] = useState([{ id: 1, date: "" }]);
  const [date, setDate] = useState<string | null>(null);

  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(null);
  const [courseAttendances, setCourseAttendances] = useState<CourseAttendance[] | null>(null);
  const [availableAttendanceTypes, setAvailableAttendanceTypes] = useState<AttendanceType[] | null>(null);
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
        case "Edit":
          fetchAllCoursesByUser();
          fetchAttendanceTypes();
          fetchAttendanceDetails();
          break;
        case "Create":
          fetchAllCoursesByUser();
          fetchAttendanceTypes();
          break;
        case "Students":
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

        const studentStatus = await GetStudentCountByAttendanceId(Number(attendanceId));

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

  const fetchAllAttendances = async () => {
    const localData = await GetOfflineUserData();
    const courses = await GetCoursesByUser(localData?.uniId!);
    let attendances: CourseAttendance[] = [];
    if (typeof courses === "string") return;
    for (const course of courses) {
      const response = await GetAttendancesByCourseCode(course.courseCode);
      if (typeof response !== "string") {
        attendances.push(...response);
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

  const validateForm = () => {
    if (!selectedCourseId || !selectedAttendanceTypeId || !startTime || !endTime || dates.some((d) => !d.date)) {
      setNormalMessage(t("fill-all-fields"));
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
      setSuccessMessage(t("Attendances added successfully"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
    }
  };

  function generateQrValue() {
    console.log(`${String(attendanceId)}-${Math.floor(Date.now() / 1000)}`)
    return `${String(attendanceId)}-${Math.floor(Date.now() / 1000)}`;
  }



  // Handle adding and editing use cases
  const addDateField = () => {
    setDates([...dates, { id: Date.now(), date: "" }]);
  };
  const removeDateField = (id: number) => {
    setDates(dates.filter((entry) => entry.id !== id));
  };
  const updateDateField = (id: number, newDate: string) => {
    setDates((prevDates) => prevDates.map((entry) => (entry.id === id ? { ...entry, date: newDate } : entry)));
  };

  return (
    <>
      <SideBar />
      <div className="flex max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          {navState === "Main" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <div className="flex flex-row w-full justify-between items-center gap-3">
                <TextBox icon="search-icon" placeHolder="Course name or code" />
                <IconButton icon="search-icon" onClick={console.log} />
              </div>
              {courseAttendances?.map((attendance) => (
                <ContainerCardLarge
                  key={attendance.attendanceId}
                  boldLabelA={String(attendance.courseName)}
                  boldLabelB={`(${String(attendance.courseCode)})`}
                  extraData={{ fieldName: t("date-time"), data: String(attendance.date) }}
                  linkText={t("view-details")}
                  onClick={() => navigate(`/Attendances/Details/${attendance.attendanceId}`)}
                />
              ))}
              <NormalLink text="Add new attendance" onClick={() => setNavState("Create")} />
            </div>
          )}
          {navState === "Create" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">{"Add attendance"}</span>
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
                  label="Course"
                />
                <DropDownList
                  icon="attendance-type-icon"
                  options={
                    availableAttendanceTypes?.map((type) => ({
                      label: type.attendanceType,
                      value: String(type.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedAttendanceTypeId(e.target.value)}
                  label="Attendance type"
                />
                <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs gap-4">
                  <div className="flex flex-col items-start">
                    <div>
                      <span className="text-xl font-semibold mr-2">{"Start time:"}</span>
                      <TimeSelector value={String(startTime)} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">{"End time:"}</span>
                      <TimeSelector value={String(endTime)} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                  </div>
                </div>
                <span className="text-xl mr-2 font-semibold self-start">{"Kuupäevad:"}</span>
                <div className="flex flex-col">
                  {dates.map((entry) => (
                    <div key={entry.id} className="flex flex-row gap-0">
                      <DateSelector value={entry.date} onChange={(e) => updateDateField(entry.id, e.target.value)} />
                      {dates.length > 1 && <NormalLink text={"Remove"} onClick={() => removeDateField(entry.id)} />}
                    </div>
                  ))}
                </div>
                <NormalLink text={"Add more dates"} onClick={addDateField} />
                <div className="py-4 flex justify-center">
                  {successMessage && <SuccessMessage text={t(successMessage)} />}
                  {normalMessage && <NormalMessage text={t(normalMessage)} />}
                  {errorMessage && <ErrorMessage text={t(errorMessage)} />}
                </div>
                <NormalButton text="Add attendance" onClick={handleAttendanceAdd} />
              </div>
            </div>
          )}
          {navState === "Details" && (
            <>
              <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
                <span className="text-2xl font-bold self-start">{"Attendance details"}</span>
                <div>
                  <DataField fieldName="Course name" data={String(attendanceData?.courseName)} />
                  <DataField fieldName="Course code" data={String(attendanceData?.courseCode)} />
                  <DataField fieldName="Attendance type" data={String(attendanceData?.attendanceType)} />
                  <DataField fieldName="Date" data={String(attendanceData?.date)} />
                  <DataField fieldName="Start time" data={String(attendanceData?.startTime)} />
                  <DataField fieldName="End time" data={String(attendanceData?.endTime)} />
                  <DataField fieldName="ID" data={ToSixDigit(Number(attendanceData?.attendanceId))} />
                  <div className="flex flex-col items-start mt-3">
                    <NormalLink text="View students" onClick={() => setNavState("Students")} />
                    <NormalLink text="View QR" onClick={() => setNavState("QR")} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <NormalLink
                    text="Edit details"
                    onClick={() => {
                      setEditCourse("ITI0209");
                      setNavState("Edit");
                    }}
                  />
                  <NormalLink text="Go back" onClick={() => navigate(-1)}/>
                  <NormalLink text="Delete course" onClick={console.log} />
                </div>
              </div>
              <QuickNavigation
                quickNavItemA={{
                  label: "Add new attendance in this course",
                  onClick: () => navigate("/Statistics"),
                }}
                quickNavItemB={{
                  label: "View statistics of this course",
                  onClick: () => navigate("/Statistics"),
                }}
              />
            </>
          )}
          {navState === "Edit" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">{"Edit attendance"}</span>
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
                  value={String(selectedCourseId)}
                  label="Course"
                />
                <DropDownList
                  icon="attendance-type-icon"
                  options={
                    availableAttendanceTypes?.map((type) => ({
                      label: type.attendanceType,
                      value: String(type.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedAttendanceTypeId(e.target.value)}
                  value={String(selectedAttendanceTypeId)}
                  label="Attendance type"
                />
                <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs gap-4">
                  <div className="flex flex-col items-start">
                    <div>
                      <span className="text-xl font-semibold mr-2">{"Start time:"}</span>
                      <TimeSelector value={String(startTime)} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">{"End time:"}</span>
                      <TimeSelector value={String(endTime)} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">{"Kuupäev:"}</span>
                      <DateSelector value={String(date)} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  {successMessage && <SuccessMessage text={t(successMessage)} />}
                  {normalMessage && <NormalMessage text={t(normalMessage)} />}
                  {errorMessage && <ErrorMessage text={t(errorMessage)} />}
                </div>
                <NormalButton
                  text="Edit attendance"
                  onClick={() => navigate(`/Attendances/Edit/${attendanceData?.attendanceId}`)}
                />
              </div>
            </div>
          )}
          {navState === "Students" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">{"Students in this attendance"}</span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField dataA="213453IACB" dataB="Aleksander Laasmägi" />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
              </div>
              <div className="flex justify-between">
                <NormalLink
                  text="Go back"
                  onClick={() => {
                    setNavState("Details");
                  }}
                />
                <NormalLink text="Download as PDF" onClick={console.log} />
              </div>
            </div>
          )}
          {navState === "QR" && (
            <div className="flex flex-col max-md:w-90 md:max-w-6xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="md:text-5xl max-md:text-2xl font-bold self-center">{"QR of this attendance"}</span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <QrGenerator value={qrValue} />
                <div className="flex flex-row gap-5 justify-items-center">
                  <img src={Icons["key-icon"]} className="md:h-13 max-md:h-8" />
                  <span className="md:text-5xl max-md:text-2xl font-bold">{ToSixDigit(parseInt(attendanceId!))+  "-" + String(Math.floor(Date.now() / 1000))}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <NormalLink
                  text="Go back"
                  onClick={() => navigate(-1)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AttendancesView;
