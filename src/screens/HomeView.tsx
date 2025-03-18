import "../App.css";
import SideBar from "../layout/SideBar";

function HomeView() {
  return (
    <>
      <SideBar />
      <div className="max-h-screen max-w-screen">
        <h1>Home</h1>
      </div>
    </>
  );
}

export default HomeView;
