import "../App.css";
import NormalButton from "../components/NormalButton";
import { useNavigate } from "react-router-dom";

function LoginView() {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-h-screen max-w-screen">
        <h1>LoginView</h1>
        <NormalButton text={"Log in"} onClick={() => navigate("/Home")} />
      </div>
    </>
  );
}

export default LoginView;
