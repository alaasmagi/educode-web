import { useEffect, useState } from "react";
import "../App.css";
import ContainerCardSmall from "../components/ContainerCardSmall";
import TextBox from "../components/TextBox";
import SideBar from "../layout/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "../components/IconButton";
import StatisticChart from "../components/StatisticChart";
import {
  GetCoursebyId,
  GetCoursesByUser,
  GetCourseStudentCounts,
} from "../businesslogic/CourseDataFetch";
import { GetOfflineUserData } from "../businesslogic/UserDataOffline";
import Course from "../models/CourseModel";
import LocalUserData from "../models/LocalUserDataModel";
import StudentCountModel from "../models/StudentCountModel";
import NormalMessage from "../components/NormalMessage";
import NormalLink from "../components/Link";

function StatisticsView() {
  const [navState, setNavState] = useState<string>("Main");
  const { status, courseId } = useParams();
  const [availableCourses, setAvailableCourses] = useState<Course[] | null>(
    null
  );
  const [localData, setLocalData] = useState<LocalUserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalMessage, setNormalMessage] = useState<string | null>(null);
  const [courseStatistics, setCourseStatistics] = useState<
    StudentCountModel[] | null
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
          fetchUserData();
          fetchAllCoursesByUser();
          break;
        case "View":
          fetchCourseStatistics();
          break;
        default:
          break;
      }
      setTimeout(() => setErrorMessage(null), 3000);
      setTimeout(() => setNormalMessage(null), 3000);
    };

    fetchData();
  }, [navState, courseId]);

  const fetchCourseStatistics = async () => {
    if (courseId) {
      const status = await GetCourseStudentCounts(Number(courseId));
      if (typeof status === "string") {
        setErrorMessage(status);
      } else {
        setCourseStatistics(status);
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
    if (userData == null) {
      navigate("/");
      return;
    }
    setLocalData(userData);
  };
  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          {navState === "Main" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <span className="text-2xl font-bold self-start">
                {"All attendances"}
              </span>
              {availableCourses?.map((course) => (
                <ContainerCardSmall
                  key={course.id}
                  boldLabelA={String(course.courseName)}
                  boldLabelB={`(${String(course.courseCode)})`}
                  linkText={t("view-stats")}
                  onClick={() => navigate(`/Statistics/View/${course.id}`)}
                />
              ))}
            </div>
          )}
          {navState === "View" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
              <span className="text-2xl font-bold self-start">
                {"Statistics:"}
              </span>
              {courseStatistics && <StatisticChart data={courseStatistics} />}
              {courseStatistics == null && (
                <div className="flex self-center">
                  <NormalMessage text={t("no-data-available")} />
                </div>
              )}
              <NormalLink text="Go back" onClick={() => navigate(-1)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StatisticsView;
