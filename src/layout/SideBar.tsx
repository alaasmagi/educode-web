import { useState } from "react";
import { SideBarItem } from "../components/SideBarItem";
import NormalButton from "../components/NormalButton";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("Home");

  return (
    <div className="flex flex-col mt-5 h-[calc(100vh-4rem)] overflow-y-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 md:hidden text-white bg-main-dark fixed top-4 left-4 z-50 rounded-md"
      >
        ☰
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-main-dark text-white w-70 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        <div className="p-5 text-xl font-bold flex items-center gap-2">
          <img
            src="./logos/splash-logo.png"
            alt="EduCode Logo"
            className="h-12 w-auto"
          />
        </div>

        <nav className="flex flex-col mt-5">
          {["Home", "Courses", "Attendances", "Statistics"].map(
            (item, index, array) => (
              <div key={item}>
                <SideBarItem
                  label={item}
                  isSelected={selected === item}
                  onClick={() => setSelected(item)}
                />
                {index !== array.length - 1 && (
                  <div className="bottom-0 w-55 h-0.5 bg-main-blue"></div>
                )}
              </div>
            )
          )}
        </nav>

        <div className="absolute bottom-5 w-full flex justify-center">
          <NormalButton text="Settings" onClick={() => console.log("CHECK")} />
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
