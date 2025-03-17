import "../App.css";

interface SideBarItemProperties {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const SideBarItem: React.FC<SideBarItemProperties> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center px-5 md:py-5 max-md:py-3 cursor-pointer  ${
        isSelected ? "bg-[#3B3B3B]" : "bg-[#2B2B2B] hover:bg-[#353535]"
      }`}
      onClick={onClick}
    >
      <span className="md:text-xl font-bold text-[#BCBCBD]">{label}</span>
    </div>
  );
};
