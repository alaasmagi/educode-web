import "../App.css";
import ContainerCardSmall from "../components/ContainerCardSmall";
import SideBar from "../layout/SideBar";

function CoursesView() {
  return (
    <>
      <SideBar />
      <div className="flex max-h-screen max-w-screen items-center justify-center md:pl-90">
        {" "}
        <ContainerCardSmall
          boldLabelA="Kasutajaliidesed"
          boldLabelB="(ITI0209)"
          linkText="View"
          onClick={console.log}
        />
      </div>
    </>
  );
}

export default CoursesView;
