import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import {
  formatDateAndTime,
  getAvatarName,
  countOrderItems,
  getOrderStatusLabel,
} from "../../utils";

const getStatusStyles = (status) => {
  switch (status) {
    case "Ready":
      return {
        badgeClass: "text-green-600 bg-[#2B4A3E]",
        description: "Listo para entrega",
        iconClass: "text-green-600",
      };
    case "Completed":
      return {
        badgeClass: "text-[#212529] bg-[#FF5733]",
        description: "Pedido entregado",
        iconClass: "text-[#2B4A3E]",
      };
    default:
      return {
        badgeClass: "text-yellow-600 bg-[#4a452e]",
        description: "Pedido en preparacion",
        iconClass: "text-yellow-600",
      };
  }
};

const OrderCard = ({
  order,
  canComplete = false,
  onComplete,
  isCompleting,
}) => {
  const rawStatus = order.orderStatus;
  const statusStyles = getStatusStyles(rawStatus);
  const statusLabel = getOrderStatusLabel(rawStatus);
  const showCompleteAction =
    canComplete && rawStatus === "Ready" && typeof onComplete === "function";

  const itemsCount = countOrderItems(order);
  const totalWithTax = Number(order.bills?.totalWithTax ?? 0).toFixed(2);

  const orderDateInstance = order.orderDate ? new Date(order.orderDate) : null;
  const orderCode = orderDateInstance
    ? Math.floor(orderDateInstance.getTime())
    : "N/D";
  const formattedDate = order.createdAt
    ? formatDateAndTime(order.createdAt)
    : "-";

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-[#f1f3f5] sm:px-6">
      <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:items-center">
        <div className="rounded-lg bg-[#f6b100] p-3 text-xl font-bold text-[#212529]">
          {getAvatarName(order.customerDetails?.name)}
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-lg font-semibold tracking-wide text-[#212529]">
              {order.customerDetails?.name ?? "Cliente"}
            </h1>
            <p className="text-sm text-[#212529]"></p>
            <p className="text-xs text-[#212529]">
              Mesa{" "}
              <FaLongArrowAltRight className="ml-2 inline text-[#ababab]" />
              {order.table?.tableNo ?? "N/D"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p
              className={`rounded-lg px-2 py-1 text-xs mt-5 font-semibold ${statusStyles.badgeClass}`}
            >
              {rawStatus === "Ready" && (
                <FaCheckDouble className="mr-2 inline" />
              )}
              {statusLabel}
            </p>
            <p className="text-xs text-[#212529]">{statusStyles.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[#212529]">
        <p className="text-sm mt-5">{formattedDate}</p>
        <p className="text-sm mt-5">{itemsCount} articulos</p>
      </div>
      <hr className="mt-4 w-full border-t border-gray-200" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-[#212529]">Total</h1>
        <p className="text-lg font-bold text-[#212529]">Bs {totalWithTax}</p>
      </div>

      {showCompleteAction && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onComplete(order)}
            disabled={isCompleting}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white ${
              isCompleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCompleting ? "Actualizando..." : "Marcar como completado"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
