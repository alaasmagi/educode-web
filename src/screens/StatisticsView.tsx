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
import DateSelector from "../components/DateSelector";
import TimeSelector from "../components/TimeSelector";
import IconButton from "../components/IconButton";
import DetailedDataField from "../components/DetailedDataField";
import QrGenerator from "../components/QrGenerator";
import { Icons } from "../components/Icons";
import StatisticChart from "../components/StatisticChart";
import { GetCoursebyId, GetCoursesByUser } from "../businesslogic/CourseDataFetch";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import Course from "../models/CourseModel";
import LocalUserData from "../models/LocalUserDataModel";

function StatisticsView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, courseId } = useParams();
  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(null);
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [editCourse, setEditCourse] = useState<string | null>(null);
  const [dates, setDates] = useState([{ id: Date.now(), date: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
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
          case "View":
            fetchCourseDetails();
            break;
          case "Edit":
            fetchCourseDetails();
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
          (status);
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
            </div>
          )}
          {navState === "Statistics" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <StatisticChart />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StatisticsView;
