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

function HomeView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col max-md:w-90 md:w-xl bg-main-dark rounded-3xl p-6 gap-5">
            <span className="text-2xl font-bold self-start">
              {t("ongoing-attendance") + ":"}
            </span>
            <div className="flex flex-col gap-2 items-start">
              <DataField
                fieldName={t("course-name")}
                data={"Kasutajaliidesed"}
              />
              <DataField fieldName={t("course-code")} data={"ITI0209"} />
              <DataField fieldName={t("no-of-students")} data={"25"} />
              <NormalLink
                text={t("view-attendance-details")}
                onClick={() => navigate("/Attendances")}
              />
            </div>
            <div className="my-4">
              <SuccessMessage text={t("student-add-success")} />
            </div>
            <div className="flex flex-col w-9/12 self-center items-center gap-3">
              <TextBox icon="person-icon" placeHolder={t("student-code")} />
              <NormalButton text={t("add-student")} onClick={console.log} />
            </div>
          </div>
          <QuickNavigation
            quickNavItemA={{
              label: t("add-new-attendance"),
              onClick: () => navigate("/Attendances"),
            }}
            quickNavItemB={{
              label: t("view-recent-attendance"),
              onClick: () => navigate("/Attendances"),
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HomeView;
