import { Icons } from "./Icons";

interface IconButtonProperties {
  icon: keyof typeof Icons;
  isDisabled?: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProperties> = ({
  icon,
  isDisabled = false,
  onClick,
}) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`${
        isDisabled ? "opacity-50" : "hover:bg-button-hover hover:cursor-pointer"
      } bg-button-dark p-2 border-2 rounded-2xl border-main-blue text-2xl font-bold text-main-text`}
    >
      <img src={Icons[icon]} className="h-7" />
    </button>
  );
};

export default IconButton;
