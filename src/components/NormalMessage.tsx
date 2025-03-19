interface NormalMessageProperties {
  text: string;
}

const NormalMessage: React.FC<NormalMessageProperties> = ({ text }) => {
  return (
    <span className="px-5 py-3 bg-[#16325B] border-[#4C97FF] text-[#4C97FF] text-xl font-semibold border-2 rounded-2xl md:w-xs max-md:w-2xs">
      {text}
    </span>
  );
};

export default NormalMessage;
