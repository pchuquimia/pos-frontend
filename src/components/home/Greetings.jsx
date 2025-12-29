import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const Greetings = () => {
  const userData = useSelector((state) => state.user);
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatDate = (date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return ` ${String(date.getDate()).padStart(2, "0")} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}`;
  };
  const formatTime = (date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-8 xl:pt-6">
      <div>
        <h1 className="text-[#212529] text-2xl font-semibold sm:text-3xl">
          Buenos Dias, {userData.name || "TEST USER"}
        </h1>
      </div>
      <div className="flex flex-col items-start sm:items-end">
        <h1 className="text-[#212529] text-3xl font-bold tracking-wide sm:text-4xl">
          {formatTime(dateTime)}
        </h1>
        <p className="text-[#212529] text-sm font-semibold sm:text-base">
          {formatDate(dateTime)}
        </p>
      </div>
    </div>
  );
};

export default Greetings;
