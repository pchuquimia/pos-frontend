import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import {
  countOrderItems,
  getAvatarName,
  getOrderStatusLabel,
} from "../../utils";

const getStatusStyles = (status) => {
  switch (status) {
    case "Ready":
      return {
        badgeClass: "bg-[#2e4a40] text-green-400",
        description: "Listo para entrega",
        iconClass: "text-green-400",
      };
    case "Completed":
      return {
        badgeClass: "bg-[#FF5733] text-white",
        description: "Pedido entregado",
        iconClass: "text-white",
      };
    default:
      return {
        badgeClass: "bg-[#4a452e] text-yellow-400",
        description: "Pedido en preparacion",
        iconClass: "text-yellow-400",
      };
  }
};

const OrderList = ({ order }) => {
  const statusLabel = getOrderStatusLabel(order.orderStatus);
  const statusStyles = getStatusStyles(order.orderStatus);
  const StatusIcon =
    order.orderStatus === "Ready" || order.orderStatus === "Completed"
      ? FaCheckDouble
      : FaCircle;

  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#f1f3f5] sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-5 xl:ring-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#f6b100] p-3 text-xl font-bold text-[#212529]">
            {getAvatarName(order.customerDetails?.name)}
          </span>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-wide text-[#212529]">
              {order.customerDetails?.name ?? "Cliente"}
            </h1>
            <p className="text-sm text-[#212529]">
              {countOrderItems(order)} articulos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm text-[#212529] sm:grid-cols-1 sm:gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Mesa
            </span>
            <p className="mt-1 font-semibold text-[#212529]">
              <FaLongArrowAltRight className="mr-2 inline text-[#ababab]" />
              {order.table?.tableNo ?? "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:items-end">
        <p
          className={`rounded-lg px-3 py-1 text-sm font-semibold ${statusStyles.badgeClass}`}
        >
          <StatusIcon className={`mr-2 inline ${statusStyles.iconClass}`} />
          {statusLabel}
        </p>
        <p className="text-xs text-[#6c757d] sm:text-right">
          {statusStyles.description}
        </p>
      </div>
    </div>
  );
};

export default OrderList;
