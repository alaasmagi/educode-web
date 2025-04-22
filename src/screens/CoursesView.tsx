import { useEffect, useState } from "react";
import "../App.css";
import ContainerCardSmall from "../components/ContainerCardSmall";
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
import { GetCurrentLanguage, GetOfflineUserData } from "../businesslogic/UserDataOffline";
import Course from "../models/CourseModel";
import LocalUserData from "../models/LocalUserDataModel";
import {
  AddCourse,
  DeleteCourse,
  EditCourse,
  GetCoursebyId,
  GetCoursesByUser,
  GetCourseStatuses,
} from "../businesslogic/CourseDataFetch";
import { CourseStatus } from "../models/CourseStatus";
import ErrorMessage from "../components/ErrorMessage";
import NormalMessage from "../components/NormalMessage";
import { FetchAndSaveUserDataByUniId, TestConnection } from "../businesslogic/UserDataFetch";
import i18next from "i18next";

function CoursesView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, courseId } = useParams();
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [availableCourseStatuses, setAvailableCourseStatuses] = useState<
    CourseStatus[] | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(
    null
  );
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    null
  );
  const [selectedCourseStatus, setSelectedCourseStatus] =
    useState<CourseStatus | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    init();
    fetchUserData();
    if (status) {
      setNavState(status);
    } else {
      setNavState("Main");
    }
  }, [status]);

  useEffect(() => {
    if (selectedStatus && availableCourseStatuses) {
      const statusObj = availableCourseStatuses.find(
        (s) => String(s.id) === selectedStatus
      );
      setSelectedCourseStatus(statusObj ?? null);
    }
  }, [selectedStatus, availableCourseStatuses]);

  useEffect(() => {
    const fetchData = async () => {
      switch (navState) {
        case "Main":
          fetchUserData();
          fetchAllCoursesByUser();
          break;
        case "Details":
          fetchCourseStatuses();
          fetchCourseDetails();
          break;
        case "Edit":
          fetchCourseDetails();
          fetchCourseStatuses();
          break;
        case "Create":
          fetchCourseDetails();
          fetchCourseStatuses();
          break;
        default:
          break;
      }
      setTimeout(() => setErrorMessage(null), 3000);
    };

    fetchData();
  }, [navState, courseId]);
  
  const init = async () => {
    const lang = await GetCurrentLanguage();
    if (lang) i18next.changeLanguage(lang);  
    let localData = await GetOfflineUserData();
      const loginSuccess = await FetchAndSaveUserDataByUniId(
        String(localData?.uniId)
      );
      if (typeof(loginSuccess) === "string"){
        navigate("/");
        return;
      }
      setLocalData(localData);
      setNavState(status ?? "Main");
  }

  const fetchCourseDetails = async () => {
    if (courseId) {
      const status = await GetCoursebyId(Number(courseId));
      if (typeof status === "string") {
        setErrorMessage(status);
      } else {
        setSelectedCourse(status);
        setSelectedCourseName(status.courseName),
          setSelectedCourseCode(status.courseCode);
      }
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const fetchAllCoursesByUser = async () => {
    const userData = await GetOfflineUserData();
    const response = await GetCoursesByUser(userData?.uniId!);
    if (typeof response !== "string") {
      setAvailableCourses(response);
    } else {
      setNormalMessage(response);
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
  const fetchCourseStatuses = async () => {
    const response = await GetCourseStatuses();

    if (typeof response === "string") {
      setErrorMessage(t(response));
    } else {
      setAvailableCourseStatuses(response);
    }
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const validateForm = () => {
    if (!selectedCourseName || !selectedCourseCode || !selectedCourseStatus) {
      setNormalMessage(t("all-fields-required-message"));
      setTimeout(() => setNormalMessage(null), 3000);
      return false;
    }
    return true;
  };
  const handleCourseAdd = async () => {
    const courseData: Course = {
      courseName: selectedCourseName ?? "",
      courseCode: selectedCourseCode ?? "",
      courseValidStatus: selectedCourseStatus?.id ?? 0,
    };
    console.log(courseData);
    const result = await AddCourse(localData?.uniId ?? "", courseData);
    if (typeof result === "string") {
      setErrorMessage(t(String(result)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSelectedCourseName(null);
      setSelectedCourseCode(null);
      setSelectedCourseStatus(null);
      setSuccessMessage(t("course-add-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
      setTimeout(() => navigate(`/Courses`), 3000);
    }
  };
  const handleCourseDelete = async () => {
    const status = DeleteCourse(Number(courseId));

    if (typeof status === "string") {
      setErrorMessage(t(String(status)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(t("course-delete-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
      setTimeout(() => navigate(`/Courses`), 3000);
    }
  };

  const handleCourseEdit = async () => {
    const courseData: Course = {
      courseName: selectedCourseName ?? "",
      courseCode: selectedCourseCode ?? "",
      courseValidStatus: selectedCourseStatus?.id ?? 0,
    };
    console.log(courseData);
    const result = await EditCourse(
      Number(courseId),
      localData?.uniId ?? "",
      courseData
    );
    if (typeof result === "string") {
      setErrorMessage(t(String(result)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSelectedCourseName(null);
      setSelectedCourseCode(null);
      setSelectedCourseStatus(null);
      setSuccessMessage(t("course-edit-success"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
      setTimeout(() => navigate(`/Courses`), 3000);
    }
  };

  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          {navState === "Main" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <span className="text-2xl font-bold self-start">
                {t("all-courses")}
              </span>
              {availableCourses?.map((course) => (
                <ContainerCardSmall
                  key={course.id}
                  boldLabelA={String(course.courseName)}
                  boldLabelB={`(${String(course.courseCode)})`}
                  linkText={t("view-details")}
                  onClick={() => navigate(`/Courses/Details/${course.id}`)}
                />
              ))}
              {normalMessage && (
                <div className="flex self-center">
                  <NormalMessage text={t(normalMessage)} />
                </div>
              )}
              <NormalLink
                text={t("add-new-course")}
                onClick={() => setNavState("Create")}
              />
            </div>
          )}
          {navState === "Edit" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {t("edit-course")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <TextBox
                  icon="school-icon"
                  label={t("course-name")}
                  value={selectedCourseName ?? ""}
                  onChange={setSelectedCourseName}
                />
                <TextBox
                  icon="pincode-icon"
                  label={t("course-code")}
                  value={selectedCourseCode ?? ""}
                  onChange={(text) => setSelectedCourseCode(text.trim())}
                />
                <DropDownList
                  icon="event-status-icon"
                  options={
                    availableCourseStatuses?.map((courseStatus) => ({
                      label: t(courseStatus.status),
                      value: String(courseStatus.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  value={selectedStatus ?? ""}
                  label={t("course-status")}
                />
                <div className="py-4 flex justify-center">
                  {successMessage && (
                    <SuccessMessage text={t(successMessage)} />
                  )}
                </div>
                <NormalButton
                  text={t("edit-course")}
                  onClick={handleCourseEdit}
                />
              </div>
            </div>
          )}
          {navState === "Create" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {t("add-course")}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
              <TextBox
                  icon="school-icon"
                  label={t("course-name")}
                  autofocus={true}
                  onChange={setSelectedCourseName}
                />
                <TextBox
                  icon="pincode-icon"
                  label={t("course-code")}
                  onChange={(text) => setSelectedCourseCode(text.trim())}
                />
                <DropDownList
                  icon="event-status-icon"
                  options={
                    availableCourseStatuses?.map((courseStatus) => ({
                      label: t(courseStatus.status),
                      value: String(courseStatus.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  value={selectedStatus ?? ""}
                  label={t("course-status")}
                />
                <div className="py-4 flex justify-center">
                  {successMessage && (
                    <SuccessMessage text={t(successMessage)} />
                  )}
                  {errorMessage && <ErrorMessage text={t(errorMessage)} />}
                </div>
                <NormalButton
                  text={t("add-course")}
                  onClick={handleCourseAdd}
                />
              </div>
            </div>
          )}
          {navState === "Details" && (
            <>
              <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
                <span className="text-2xl font-bold self-start">
                  {"Course details"}
                </span>
                <div>
                  <DataField
                    fieldName={t("course-name")}
                    data={selectedCourse?.courseName ?? ""}
                  />
                  <DataField
                    fieldName={t("course-code")}
                    data={selectedCourse?.courseCode ?? ""}
                  />
                  <DataField
                    fieldName={t("course-status")}
                    data={t(
                      availableCourseStatuses?.find(
                        (status) =>
                          status.id === selectedCourse?.courseValidStatus
                      )?.status ?? ""
                    )}
                  />
                </div>
                <div className="py-4 flex justify-center">
                  {successMessage && (
                    <SuccessMessage text={t(successMessage)} />
                  )}
                </div>
                <div className="flex justify-between">
                  <NormalLink
                    text={t("edit-details")}
                    onClick={() => {
                      setNavState("Edit");
                    }}
                  />
                  <NormalLink
                    text={t("go-back")}
                    onClick={() => navigate(-1)}
                  />
                  <NormalLink
                    text={t("delete-course")}
                    onClick={handleCourseDelete}
                  />
                </div>
              </div>
              <QuickNavigation
                quickNavItemA={{
                  label: t("add-new-attendance"),
                  onClick: () => navigate("/Attendances/Create"),
                }}
                quickNavItemB={{
                  label: t("view-statistics"),
                  onClick: () => navigate(`/Statistics/View/${courseId}`),
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CoursesView;
