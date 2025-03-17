import "./App.css";
import QrGenerator from "./components/QrGenerator";
import SideBar from "./layout/SideBar";

function App() {
  return (
    <>
      <QrGenerator value={"000003"} />
      <h1 className="text-9xl">Hello tailwind</h1>
      <SideBar />
    </>
  );
}

export default App;
