import React, { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  countOrderItems,
  createDateRange,
  formatCurrency,
  formatDate,
  formatTime,
  getOrderStatusLabel,
} from "../../utils";

const RANGE_OPTIONS = [
  { key: "day", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
];

const EXPORT_PRESETS = [
  { key: "day", label: "Exportar dia" },
  { key: "week", label: "Exportar semana" },
  { key: "month", label: "Exportar mes" },
];

const filterOrdersByRange = (orders, range) => {
  const rangeData = createDateRange({ type: range });
  if (!rangeData) return orders;
  const { start, end } = rangeData;

  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= start && orderDate <= end;
  });
};

const buildExportRows = (orders) =>
  orders.map((order) => ({
    orderId: order._id,
    date: formatDate(order.orderDate),
    time: formatTime(order.orderDate),
    customer: order.customerDetails?.name ?? "Cliente",
    status: getOrderStatusLabel(order.orderStatus),
    items: countOrderItems(order),
    total: Number(order?.bills?.totalWithTax ?? 0).toFixed(2),
    paymentMethod: order.paymentMethod ?? "-",
  }));

const downloadCSV = (rows, fileName) => {
  if (!rows.length) return;

  const headers = [
    "Pedido",
    "Fecha",
    "Hora",
    "Cliente",
    "Estado",
    "Articulos",
    "Total",
    "Metodo de pago",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.orderId,
        row.date,
        row.time,
        row.customer,
        row.status,
        row.items,
        row.total,
        row.paymentMethod,
      ].join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const Metrics = ({ orders = [], range, onRangeChange, onExport }) => {
  const [localRange, setLocalRange] = useState(range ?? "day");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  useEffect(() => {
    if (range && range !== localRange) {
      setLocalRange(range);
    }
  }, [range, localRange]);

  const filteredOrders = useMemo(
    () => filterOrdersByRange(orders, localRange),
    [orders, localRange]
  );

  const summary = useMemo(() => {
    const totalSales = filteredOrders.reduce(
      (sum, order) => sum + Number(order?.bills?.totalWithTax ?? 0),
      0
    );
    const dishesSold = filteredOrders.reduce(
      (sum, order) => sum + countOrderItems(order),
      0
    );
    const tickets = filteredOrders.length;

    const averageTicket = tickets ? totalSales / tickets : 0;

    return {
      totalSales,
      dishesSold,
      tickets,
      averageTicket,
    };
  }, [filteredOrders]);

  const exportData = (targetRange) => {
    const exportRange = targetRange || localRange;
    const payload = { type: exportRange };

    if (exportRange === "custom-date") {
      if (!customRange.from || !customRange.to) {
        enqueueSnackbar("Selecciona una fecha de inicio y fin", {
          variant: "warning",
        });
        return;
      }

      if (new Date(customRange.from) > new Date(customRange.to)) {
        enqueueSnackbar("La fecha de inicio no puede ser mayor a la final", {
          variant: "warning",
        });
        return;
      }

      payload.start = customRange.from;
      payload.end = customRange.to;
    }

    const exportRangeData = createDateRange(payload);

    if (!exportRangeData) {
      enqueueSnackbar("Por favor define un rango valido para exportar", {
        variant: "warning",
      });
      return;
    }

    const ordersForExport = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate >= exportRangeData.start && orderDate <= exportRangeData.end
      );
    });

    if (!ordersForExport.length) {
      enqueueSnackbar("No hay datos para exportar en el rango seleccionado", {
        variant: "info",
      });
      return;
    }

    const rows = buildExportRows(ordersForExport);
    const fileLabel =
      exportRange === "custom-date"
        ? `${customRange.from || "inicio"}-${customRange.to || "fin"}`
        : exportRange;
    const fileName = `ventas-${fileLabel}-${new Date()
      .toISOString()
      .slice(0, 10)}`;

    downloadCSV(rows, fileName);
    if (typeof onExport === "function") {
      onExport(exportRange);
    }
  };

  const handleRangeChange = (nextRange) => {
    setLocalRange(nextRange);
    if (typeof onRangeChange === "function") {
      onRangeChange(nextRange);
    }
  };

  const handleCustomRangeChange = (event) => {
    const { name, value } = event.target;
    setCustomRange((prev) => ({ ...prev, [name]: value }));
  };

  const cards = [
    {
      title: "Ganancias",
      value: formatCurrency(summary.totalSales),
      caption: "Ventas totales en el periodo",
    },
    {
      title: "Platos Vendidos",
      value: summary.dishesSold,
      caption: "Cantidad de platos servidos",
    },
    {
      title: "Tickets",
      value: summary.tickets,
      caption: "Pedidos generados",
    },
    {
      title: "Ticket Promedio",
      value: formatCurrency(summary.averageTicket),
      caption: "Promedio por pedido",
    },
  ];

  const isCustomRangeReady = Boolean(customRange.from && customRange.to);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white/90 p-6 text-[#212529] shadow-sm ring-1 ring-[#f1f3f5] lg:p-8 xl:bg-white xl:shadow-lg xl:ring-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#212529]">Reporte de ventas</h2>
            <p className="text-sm text-[#6c757d]">
              Analiza el desempeno y exporta la informacion consolidada.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="grid gap-3 rounded-2xl bg-[#f8f9fa] px-4 py-3 ring-1 ring-[#e9ecef] sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
                  Desde
                </label>
                <input
                  type="date"
                  name="from"
                  value={customRange.from}
                  onChange={handleCustomRangeChange}
                  className="rounded-lg border border-[#dee2e6] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
                  Hasta
                </label>
                <input
                  type="date"
                  name="to"
                  value={customRange.to}
                  onChange={handleCustomRangeChange}
                  className="rounded-lg border border-[#dee2e6] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                />
              </div>
              <button
                type="button"
                onClick={() => exportData("custom-date")}
                disabled={!isCustomRangeReady}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isCustomRangeReady
                    ? "bg-[#f6b100] text-[#1f2937] hover:bg-[#dda108]"
                    : "bg-[#fef3c7] text-[#b38b21] cursor-not-allowed"
                }`}
              >
                Exportar rango
              </button>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-1 rounded-full bg-[#f1f3f5] p-1">
                {RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleRangeChange(option.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      localRange === option.key
                        ? "bg-[#f6b100] text-[#212529]"
                        : "text-[#212529]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPORT_PRESETS.map((button) => (
                  <button
                    key={button.key}
                    onClick={() => exportData(button.key)}
                    className="rounded-lg bg-[#f6b100] px-4 py-2 text-sm font-semibold text-[#212529] transition-colors hover:bg-[#dda108]"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-[#f8f9fa] p-5 ring-1 ring-[#e9ecef]"
            >
              <p className="text-sm text-[#6c757d]">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              <p className="mt-2 text-xs text-[#6c757d]">{card.caption}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#e9ecef] bg-white shadow-sm">
          <div className="border-b border-[#e9ecef] bg-[#f8f9fa] px-5 py-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#212529]">
              Resumen de pedidos ({filteredOrders.length})
            </h3>
          </div>
          <div className="hidden max-h-64 overflow-y-auto md:block">
            <table className="w-full text-left text-sm text-[#212529]">
              <thead className="sticky top-0 bg-[#f8f9fa] text-[#6c757d]">
                <tr>
                  <th className="px-5 py-3">Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Hora</th>
                  <th className="px-5 py-3">Platos</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td className="px-5 py-4 text-[#6c757d]" colSpan={7}>
                      No se registraron pedidos en este periodo.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-t border-[#e9ecef]">
                      <td className="px-5 py-3">#{order._id.slice(-6)}</td>
                      <td className="px-5 py-3">{order.customerDetails?.name ?? "Cliente"}</td>
                      <td className="px-5 py-3">{formatDate(order.orderDate)}</td>
                      <td className="px-5 py-3">{formatTime(order.orderDate)}</td>
                      <td className="px-5 py-3">{countOrderItems(order)}</td>
                      <td className="px-5 py-3">{formatCurrency(order?.bills?.totalWithTax ?? 0)}</td>
                      <td className="px-5 py-3">{getOrderStatusLabel(order.orderStatus)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 px-5 py-5 md:hidden">
            {filteredOrders.length === 0 ? (
              <p className="text-sm text-[#6c757d]">
                No se registraron pedidos en este periodo.
              </p>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-[#e9ecef] bg-[#f8f9fa] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#212529]">
                    Pedido #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-[#6c757d]">
                    {order.customerDetails?.name ?? "Cliente"}
                  </p>
                  <p className="mt-2 text-xs text-[#6c757d]">
                    {formatDate(order.orderDate)} - {formatTime(order.orderDate)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#212529]">
                    <span>{countOrderItems(order)} platos</span>
                    <span>{formatCurrency(order?.bills?.totalWithTax ?? 0)}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#212529]">
                    {getOrderStatusLabel(order.orderStatus)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Metrics;
