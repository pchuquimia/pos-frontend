import React from "react";
import { getAvatarName, getBgColor } from "../utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";

const STATUS_META = {
  booked: {
    label: "Ocupado",
    badgeClass: "bg-[#dda108] text-[#212529]",
  },
  available: {
    label: "Disponible",
    badgeClass: "bg-[#1CA571] text-[#212529]",
  },
};

const ORDER_STATUS_META = {
  "In Progress": {
    label: "En progreso",
    className: "bg-[#dda108] text-[#212529]",
  },
  Ready: {
    label: "Listo",
    className: "bg-[#dcfce7] text-[#166534]",
  },
  Completed: {
    label: "Completado",
    className: "bg-[#e2e8f0] text-[#334155]",
  },
};

const TableCard = ({
  id,
  name,
  status,
  initials,
  seats,
  orderStatus,
  onRelease,
  isReleasing = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const normalizedStatus = status?.toLowerCase() ?? "";
  const isBooked = normalizedStatus === "booked";
  const statusMeta = STATUS_META[normalizedStatus] ?? {
    label: status ?? "-",
    badgeClass: "bg-[#f1f5f9] text-[#475569]",
  };
  const orderStatusMeta = orderStatus ? ORDER_STATUS_META[orderStatus] : null;

  const guestName = initials ?? (isBooked ? "Invitado" : "Sin reserva");
  const avatarColor = initials ? getBgColor() : "#ffffff";

  const handleCardClick = () => {
    if (isBooked) return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  const handleRelease = (event) => {
    event.stopPropagation();
    if (typeof onRelease !== "function" || isReleasing) return;
    onRelease();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex h-full min-h-[260px] flex-col justify-between rounded-2xl bg-white/95 p-6 shadow-[0_10px_30px_rgba(246,177,0,0.08)] transition-all duration-200 ${
        isBooked
          ? "cursor-default hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(246,177,0,0.15)]"
          : "hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(246,177,0,0.2)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#94a3b8]">
            Mesa
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#1f2937]">{name}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-[#ffffff]"
          style={{ backgroundColor: avatarColor }}
        >
          {getAvatarName(guestName) || "MS"}
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-[#94a3b8]">
            Cliente
          </span>
          <span className="text-base font-semibold text-[#1f2937]">
            {guestName}
          </span>
          <span className="text-xs text-[#94a3b8]">{seats} asientos</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {orderStatusMeta && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusMeta.className}`}
          >
            {orderStatusMeta.label}
          </span>
        )}
        {!isBooked && (
          <span className="rounded-full bg-[#FFFFF] px-3 py-1 text-xs font-semibold text-[#212529]">
            Disponible para asignar
          </span>
        )}
      </div>

      {isBooked && typeof onRelease === "function" && (
        <button
          type="button"
          onClick={handleRelease}
          disabled={isReleasing}
          className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            isReleasing
              ? "bg-[#fef3c7] text-[#FF5733] cursor-not-allowed"
              : "bg-[#FF5733] text-[#1f2937] hover:bg-[#dda108]"
          }`}
        >
          {isReleasing ? "Liberando..." : "Liberar mesa"}
        </button>
      )}
    </div>
  );
};

export default TableCard;
