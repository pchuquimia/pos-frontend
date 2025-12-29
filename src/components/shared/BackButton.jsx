import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-[#FF5733] text-[#f5f5f5] p-2 text-2xl font-bold rounded-full"
    >
      <IoMdArrowRoundBack />
    </button>
  );
};

export default BackButton;
