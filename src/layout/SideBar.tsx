import { useState, useEffect } from "react";
import { SideBarItem } from "../components/SideBarItem";
import NormalButton from "../components/NormalButton";
import { Icons } from "../components/Icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelected(location.pathname.slice(1));
  }, []);

  return (
    <div className="flex flex-row mt-5 max-md:mb-5 overflow-y-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 md:hidden bg-button-dark border-main-blue border-2 fixed top-5 right-5 z-50 rounded-2xl "
      >
        <img src={Icons["menu-icon"]} className="h-7"></img>
      </button>
      <div
        className={`fixed top-0 left-0 h-screen bg-main-dark text-white md:w-90 max-md:w-screen transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        <div className="p-5 text-xl font-bold flex items-center gap-2">
          <img
            src="./logos/splash-logo.png"
            alt="EduCode Logo"
            className="md:h-15 max-md:h-12 w-auto"
          />
        </div>

        <nav className="flex flex-col mt-5">
          {["Home", "Courses", "Attendances", "Statistics"].map(
            (item, index, array) => (
              <div key={item}>
                <SideBarItem
                  label={item}
                  isSelected={selected === item}
                  onClick={() => {
                    setSelected(item);
                    setIsOpen(false);
                    navigate(`/${item}`);
                  }}
                />
                {index !== array.length - 1 && (
                  <div className="bottom-0 w-55 h-0.5 bg-main-blue"></div>
                )}
              </div>
            )
          )}
        </nav>

        <div className="absolute bottom-5 w-full flex justify-center">
          <NormalButton
            text="Settings"
            onClick={() => {
              navigate(`/Settings`);
              setIsOpen(false);
              setSelected(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
