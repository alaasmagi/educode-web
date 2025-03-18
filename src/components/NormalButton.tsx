interface NormalButtonProperties {
  text: string;
  isDisabled?: boolean;
  onClick: () => void;
}

const NormalButton: React.FC<NormalButtonProperties> = ({
  text,
  isDisabled = false,
  onClick,
}) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className="bg-button-dark hover:bg-button-hover w-2xs py-3 border-2 rounded-2xl border-main-blue text-2xl font-bold text-main-text"
    >
      {text}
    </button>
  );
};

export default NormalButton;
