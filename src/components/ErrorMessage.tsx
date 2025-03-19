interface ErrorMessageProperties {
  text: string;
}

const ErrorMessage: React.FC<ErrorMessageProperties> = ({ text }) => {
  return (
    <span className="px-5 py-3 bg-[#3F1E20] border-[#DD2D4A] text-[#DD2D4A] text-xl font-semibold border-2 rounded-2xl">
      {text}
    </span>
  );
};

export default ErrorMessage;
