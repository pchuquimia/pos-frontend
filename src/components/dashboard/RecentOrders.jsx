import React from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import {
  countOrderItems,
  formatDate,
  formatTime,
} from "../../utils";

const STATUS_OPTIONS = [
  { value: "In Progress", label: "En progreso" },
  { value: "Ready", label: "Listo" },
  { value: "Completed", label: "Completado" },
];

const PAYMENT_METHOD_LABELS = {
  Cash: "Efectivo",
  Online: "En linea",
};

const getPaymentMethodLabel = (method = "-") =>
  PAYMENT_METHOD_LABELS[method] ?? method ?? "-";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Estado del pedido actualizado", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("No se pudo actualizar el estado del pedido", {
        variant: "error",
      });
    },
  });

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Ocurrio un error", { variant: "error" });
  }

  const orders = resData?.data?.data ?? [];

  return (
    <div className="rounded-2xl bg-white/85 px-4 py-5 shadow-sm ring-1 ring-[#f1f3f5] sm:px-6 sm:py-6 xl:bg-white xl:shadow-sm xl:ring-0 xl:border xl:border-[#e9ecef]">
      <h2 className="text-[#212529] text-xl font-semibold">Pedidos recientes</h2>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm text-[#212529]">
          <thead className="bg-[#f8f9fa] text-[#6c757d]">
            <tr>
              <th className="p-3">Pedido</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Hora</th>
              <th className="p-3">Articulos</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Metodo de pago</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-[#e9ecef] hover:bg-[#f8f9fa]"
              >
                <td className="p-4">
                  #{Math.floor(new Date(order.orderDate).getTime())}
                </td>
                <td className="p-4">{order.customerDetails?.name ?? "Cliente"}</td>
                <td className="p-4">
                  <select
                    className={`rounded-lg border border-[#ced4da] p-2 text-sm focus:outline-none ${
                      order.orderStatus === "Ready"
                        ? "text-green-500"
                        : order.orderStatus === "Completed"
                        ? "text-green-400"
                        : "text-yellow-500"
                    }`}
                    value={order.orderStatus}
                    onChange={(event) =>
                      handleStatusChange({
                        orderId: order._id,
                        orderStatus: event.target.value,
                      })
                    }
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">{formatDate(new Date(order.orderDate))}</td>
                <td className="p-4">{formatTime(order.orderDate)}</td>
                <td className="p-4">{countOrderItems(order)} articulos</td>
                <td className="p-4">Bs {Number(order.bills.totalWithTax).toFixed(2)}</td>
                <td className="p-4 text-center">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-[#e9ecef] bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#212529]">
                Pedido #{Math.floor(new Date(order.orderDate).getTime())}
              </h3>
              <select
                className={`rounded-lg border border-[#ced4da] p-2 text-sm focus:outline-none ${
                  order.orderStatus === "Ready"
                    ? "text-green-500"
                    : order.orderStatus === "Completed"
                    ? "text-green-400"
                    : "text-yellow-500"
                }`}
                value={order.orderStatus}
                onChange={(event) =>
                  handleStatusChange({
                    orderId: order._id,
                    orderStatus: event.target.value,
                  })
                }
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-[#212529]">
              Cliente: {order.customerDetails?.name ?? "Cliente"}
            </p>
            <p className="text-sm text-[#212529]">
              {formatDate(new Date(order.orderDate))} - {formatTime(order.orderDate)}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[#212529]">
              <span>{countOrderItems(order)} articulos</span>
              <span>Bs {Number(order.bills.totalWithTax).toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-[#6c757d]">
              Metodo de pago: {getPaymentMethodLabel(order.paymentMethod)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
