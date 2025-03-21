import { useState } from "react";
import "../App.css";
import ContainerCardLarge from "../components/ContainerCardLarge";
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

function AttendancesView() {
  const [navState, setNavState] = useState<string>("Main");
  const [editCourse, setEditCourse] = useState<string | null>(null);
  const [dates, setDates] = useState([{ id: Date.now(), date: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const updateDateField = (id: number, newDate: string) => {
    setDates((prevDates) =>
      prevDates.map((entry) =>
        entry.id === id ? { ...entry, date: newDate } : entry
      )
    );
  };
  const addDateField = () => {
    setDates([...dates, { id: Date.now(), date: "" }]);
  };

  const removeDateField = (id: number) => {
    setDates(dates.filter((entry) => entry.id !== id));
  };

  const handleSubmit = () => {
    if (dates.every((d) => d.date)) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
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
              <ContainerCardLarge
                boldLabelA="Kasutajaliidesed"
                boldLabelB="Lecture"
                extraData={{ fieldName: "Date", data: "18.01.2025" }}
                linkText="View"
                onClick={() => setNavState("Details")}
              />
              <ContainerCardLarge
                boldLabelA="Kasutajaliidesed"
                boldLabelB="Practice"
                extraData={{ fieldName: "Date", data: "18.01.2025" }}
                linkText="View"
                onClick={console.log}
              />
              <ContainerCardLarge
                boldLabelA="Kasutajaliidesed"
                boldLabelB="Lecture"
                extraData={{ fieldName: "Date", data: "18.01.2025" }}
                linkText="View"
                onClick={console.log}
              />
              <ContainerCardLarge
                boldLabelA="Kasutajaliidesed"
                boldLabelB="Lecture + practice"
                extraData={{ fieldName: "Date", data: "18.01.2025" }}
                linkText="View"
                onClick={console.log}
              />
              <NormalLink
                text="Add new attendance"
                onClick={() => setNavState("Create")}
              />
            </div>
          )}
          {navState === "Create" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {"Add attendance"}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <DropDownList
                  icon="school-icon"
                  options={[]}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  label="Course"
                />
                <DropDownList
                  icon="attendance-type-icon"
                  options={[]}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  label="Attendance type"
                />
                <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs gap-4">
                  <div className="flex flex-col items-start">
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {"Start time:"}
                      </span>
                      <TimeSelector
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {"End time:"}
                      </span>
                      <TimeSelector
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xl mr-2 font-semibold self-start">
                  {"Kuupäevad:"}
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
                          text={"Remove"}
                          onClick={() => removeDateField(entry.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <NormalLink text={"Add more dates"} onClick={addDateField} />
                <div className="py-4 flex justify-center">
                  <SuccessMessage text={t("student-add-success")} />
                </div>
                <NormalButton text="Add attendance" onClick={console.log} />
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
                  <DataField fieldName="Course name" data="Kasutajaliidesed" />
                  <DataField fieldName="Course code" data="ITI0209" />
                  <DataField
                    fieldName="Attendance type"
                    data="Course + Lecture"
                  />
                  <DataField fieldName="Date" data="18.03.2025" />
                  <DataField fieldName="Start time" data="12:30" />
                  <DataField fieldName="End time" data="15:45" />
                  <DataField fieldName="ID" data="000002" />
                  <div className="flex flex-col items-start mt-3">
                    <NormalLink
                      text="View students"
                      onClick={() => setNavState("Students")}
                    />
                    <NormalLink
                      text="View QR"
                      onClick={() => setNavState("QR")}
                    />
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
              <span className="text-2xl font-bold self-start">
                {"Edit attendance"}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <DropDownList
                  icon="school-icon"
                  options={[]}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  label="Course"
                />
                <DropDownList
                  icon="attendance-type-icon"
                  options={[]}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  label="Attendance type"
                />
                <div className="flex flex-col max-md:max-w-full max-md:min-w-5/6 md:min-w-xs gap-4">
                  <div className="flex flex-col items-start">
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {"Start time:"}
                      </span>
                      <TimeSelector
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {"End time:"}
                      </span>
                      <TimeSelector
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-xl font-semibold mr-2">
                        {"Kuupäev:"}
                      </span>
                      <DateSelector
                        value={""}
                        onChange={(e) => updateDateField(2, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <SuccessMessage text={t("student-add-success")} />
                </div>
                <NormalButton text="Edit attendance" onClick={console.log} />
              </div>
            </div>
          )}
          {navState === "Students" && (
            <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {"Students in this attendance"}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
                  <NormalLink text="Remove" onClick={console.log} />
                </div>
                <div className="flex flex-row gap-5">
                  <DetailedDataField
                    dataA="213453IACB"
                    dataB="Aleksander Laasmägi"
                  />
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
            <div className="flex flex-col max-md:w-90 md:w-7xl bg-main-dark rounded-3xl gap-10 p-6">
              <span className="text-2xl font-bold self-start">
                {"QR of this attendance"}
              </span>
              <div className="flex flex-col gap-5 items-center justify-center self-center">
                <QrGenerator value="000002" />
                <div className="flex flex-row gap-8 items-center justify-items-center">
                  <img src={Icons["key-icon"]} className="h-15" />
                  <span className="md:text-6xl max-md:text-3xl font-bold">
                    {"000002"}
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <NormalLink
                  text="Go back"
                  onClick={() => {
                    setNavState("Details");
                  }}
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
