interface SuccessMessageProperties {
  text: string;
}

const SuccessMessage: React.FC<SuccessMessageProperties> = ({ text }) => {
  return (
    <span className="px-5 py-3 bg-[#1E3F20] border-[#57A773] text-[#57A773] text-xl font-semibold border-2 rounded-2xl">
      {text}
    </span>
  );
};

export default SuccessMessage;
