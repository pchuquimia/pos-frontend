import React from "react";

const MiniCard = ({ title, icon, value, caption }) => {
  const accentClass =
    title === "Ganancias Totales" ? "text-[#02ca3a]" : "text-[#f6b100]";

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white/90 px-5 py-5 shadow-sm ring-1 ring-[#f1f3f5] sm:px-6 sm:py-6 xl:bg-[#FFFFFF] xl:shadow-none xl:ring-0">
      <div className="flex items-start justify-between">
        <h1 className="text-[#212529] text-lg font-semibold tracking-wide sm:text-xl">
          {title}
        </h1>
        <span className={`rounded-lg bg-[#FFFFFF] p-3 text-2xl ${accentClass}`}>
          {icon}
        </span>
      </div>
      <div>
        <h1 className="text-[#212529] text-3xl font-bold sm:text-4xl">
          {value}
        </h1>
        {caption ? (
          <p className="text-[#212529] text-sm sm:text-base">{caption}</p>
        ) : null}
      </div>
    </div>
  );
};

export default MiniCard;
