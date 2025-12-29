import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../utils";
const CustomerInfo = () => {
  const [dateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col items-start">
        <h1 className="text-md font-semibold tracking-wide text-[#212529]">
          {customerData.customerName || "Nombre del cliente"}
        </h1>
        <p className="mt-1 text-xs font-medium text-[#212529]">
          #{customerData.orderId || "N/A"} / Comer dentro
        </p>
        <p className="mt-2 text-xs font-medium text-[#212529]">
          {formatDate(dateTime)} / 08:32 PM
        </p>
      </div>
      <span className="rounded-lg bg-[#f6b100] p-3 text-xl font-bold text-[#212529]">
        {getAvatarName(customerData.customerName) || "CN"}
      </span>
    </div>
  );
};

export default CustomerInfo;
