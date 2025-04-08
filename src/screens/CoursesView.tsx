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
import IconButton from "../components/IconButton";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import Course from "../models/CourseModel";
import LocalUserData from "../models/LocalUserDataModel";
import { AddCourse, GetCoursebyId, GetCoursesByUser, GetCourseStatuses } from "../businesslogic/CourseDataFetch";
import { CourseStatus } from "../models/CourseStatus";

function CoursesView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, courseId } = useParams();
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [availableCourseStatuses, setAvailableCourseStatuses] = useState<CourseStatus[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [selectedCourseStatus, setSelectedCourseStatus] = useState<CourseStatus | null>(null);
  const [editCourse, setEditCourse] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
      setTimeout(() => setNormalMessage(null), 3000);
    };

    fetchData();
  }, [navState, courseId]);

  const fetchCourseDetails = async () => {
    if (courseId) {
      const status = await GetCoursebyId(Number(courseId));
      if (typeof status === "string") {
        setErrorMessage(status);
      } else {
        setSelectedCourse(status);
      }
      setTimeout(() => setErrorMessage(null), 3000);
      setTimeout(() => setNormalMessage(null), 3000);
    }
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
      setNormalMessage(t("fill-all-fields"));
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
      setSuccessMessage(t("Course added successfully"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => setNavState("Main"), 3000);
    }
  };
  const handleCourseDelete = async () => {
    //const status = DeleteCourse(Number(attendanceId));

    if (typeof status === "string") {
      setErrorMessage(t(String(status)));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setSuccessMessage(t("Attendances deleted successfully"));
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimeout(() => navigate(`/Attendances`), 3000);
    }
  };

  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          {navState === "Main" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <div className="flex flex-row w-full justify-between items-center gap-3">
                <TextBox icon="search-icon" placeHolder="Course name or code" />
                <IconButton icon="search-icon" onClick={console.log} />
              </div>
              {availableCourses?.map((course) => (
                <ContainerCardSmall
                  key={course.id}
                  boldLabelA={String(course.courseName)}
                  boldLabelB={`(${String(course.courseCode)})`}
                  linkText={t("view-details")}
                  onClick={() => navigate(`/Courses/Details/${course.id}`)}
                />
              ))}
              <NormalLink text="Add new course" onClick={() => setNavState("Create")} />
            </div>
          )}
          {navState === "Edit" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">{"Edit course"}</span>

              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <TextBox icon="school-icon" placeHolder="Course name" />
                <TextBox icon="pincode-icon" placeHolder="Course code" />
                <DropDownList
                  icon="event-status-icon"
                  options={
                    availableCourseStatuses?.map((courseStatus) => ({
                      label: courseStatus.status,
                      value: String(courseStatus.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="course status"
                />
                <div className="py-4 flex justify-center">
                  <SuccessMessage text={t("student-add-success")} />
                </div>
                {editCourse ? (
                  <NormalButton text="Edit course" onClick={console.log} />
                ) : (
                  <NormalButton text="Add course" onClick={console.log} />
                )}
              </div>
            </div>
          )}
          {navState === "Create" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">{"Add course"}</span>

              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <TextBox
                  icon="school-icon"
                  placeHolder="Course name"
                  value={selectedCourseName ?? ""}
                  onChange={setSelectedCourseName}
                />
                <TextBox
                  icon="pincode-icon"
                  placeHolder="Course code"
                  value={selectedCourseCode ?? ""}
                  onChange={setSelectedCourseCode}
                />
                <DropDownList
                  icon="event-status-icon"
                  options={
                    availableCourseStatuses?.map((courseStatus) => ({
                      label: courseStatus.status,
                      value: String(courseStatus.id),
                    })) || []
                  }
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="course status"
                />
                <div className="py-4 flex justify-center">
                  {successMessage && <SuccessMessage text={t(successMessage)} />}
                </div>
                <NormalButton text="Add course" onClick={handleCourseAdd} />
              </div>
            </div>
          )}
          {navState === "Details" && (
            <>
              <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
                <span className="text-2xl font-bold self-start">{"Course details"}</span>
                <div>
                  <DataField fieldName="Course name" data={selectedCourse?.courseName ?? ""} />
                  <DataField fieldName="Course code" data={selectedCourse?.courseCode ?? ""} />
                  <DataField
                    fieldName="Status"
                    data={
                      availableCourseStatuses?.find((status) => status.id === selectedCourse?.courseValidStatus)
                        ?.status ?? ""
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <NormalLink
                    text="Edit details"
                    onClick={() => {
                      setEditCourse(selectedCourseId);
                      setNavState("Edit");
                    }}
                  />
                  <NormalLink text="Go back" onClick={() => navigate(-1)} />
                  <NormalLink text="Delete course" onClick={handleCourseDelete} />
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
        </div>
      </div>
    </>
  );
}

export default CoursesView;
