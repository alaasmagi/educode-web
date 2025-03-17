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
      className="bg-[#1E1E1E] hover:bg-[#282828] w-60 md:py-3 max-md:py-2 border-2 rounded-2xl border-[#4492EA] md:text-2xl font-bold text-[#BCBCBD]"
    >
      {text}
    </button>
  );
};

export default NormalButton;
