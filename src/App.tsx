import "./App.css";
import QrGenerator from "./components/QrGenerator";

function App() {
  return (
    <>
      <QrGenerator value={"000003"} />
      <h1 className="text-xl text-red-500">Hello tailwind</h1>
    </>
  );
}

export default App;
