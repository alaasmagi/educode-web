import { useState } from "react";
import "../App.css";
import ContainerCardSmall from "../components/ContainerCardSmall";
import NormalLink from "../components/Link";
import TextBox from "../components/TextBox";
import SideBar from "../layout/SideBar";
import NormalButton from "../components/NormalButton";
import DropDownList from "../components/DropdownList";
import DataField from "../components/DataField";
import QuickNavigation from "../layout/QuickNavigation";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../components/SuccessMessage";
import { useTranslation } from "react-i18next";
import DateSelector from "../components/DateSelector";
import TimeSelector from "../components/TimeSelector";
import IconButton from "../components/IconButton";
import DetailedDataField from "../components/DetailedDataField";
import QrGenerator from "../components/QrGenerator";
import { Icons } from "../components/Icons";
import StatisticChart from "../components/StatisticChart";

function StatisticsView() {
  const [navState, setNavState] = useState<string>("Main");
  const [editCourse, setEditCourse] = useState<string | null>(null);
  const [dates, setDates] = useState([{ id: Date.now(), date: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
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
              <ContainerCardSmall
                boldLabelA="Kasutajaliidesed"
                boldLabelB="(ITI0209)"
                linkText="Statistics"
                onClick={() => setNavState("Statistics")}
              />
              <ContainerCardSmall
                boldLabelA="Kasutajaliidesed"
                boldLabelB="(ITI0209)"
                linkText="Statistics"
                onClick={console.log}
              />
              <ContainerCardSmall
                boldLabelA="Kasutajaliidesed"
                boldLabelB="(ITI0209)"
                linkText="Statistics"
                onClick={console.log}
              />
              <ContainerCardSmall
                boldLabelA="Kasutajaliidesed"
                boldLabelB="(ITI0209)"
                linkText="Statistics"
                onClick={console.log}
              />
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
