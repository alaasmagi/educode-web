import "./App.css";
import QrGenerator from "./components/QrGenerator";

function App() {
  return (
    <>
      <QrGenerator value={"000003"} />
      <h1 className="text-9xl">Hello tailwind</h1>
    </>
  );
}

export default App;
