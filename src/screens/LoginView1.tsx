import "../App.css";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox";

function LoginView() {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center gap-10">
        <div className="flex flex-col md:p-20 max-md:p-10 items-center gap-20 bg-main-dark rounded-3xl">
          <img src="../logos/splash-logo.png" className="md:w-xl" />
          <div className="flex flex-col gap-3.5">
            <TextBox icon="person-icon" placeHolder={"UniID"}/> 
            <TextBox icon="lock-icon" placeHolder={"Password"} isPassword={true}/> 
            <NormalButton text={"Log in"} onClick={() => navigate("/Home")} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginView;
