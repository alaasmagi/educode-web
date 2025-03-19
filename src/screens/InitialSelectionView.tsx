import "../App.css";
import LanguageSwitch from "../components/LanguageSwitch";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";

function InitialSelectionView() {
  const navigate = useNavigate();

  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="w-xl" />
          <LanguageSwitch/>
          <div className="flex flex-col gap-3.5">
            <NormalButton text={"Log in"} onClick={() => navigate("/Login")} />
            <NormalButton
              text={"Register as teacher"}
              onClick={() => navigate("/Home")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default InitialSelectionView;
