import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <FaSpinner className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
