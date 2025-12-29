import React from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https";
import {
  extractOrderItems,
  getOrderItemLabel,
  getOrderItemQuantity,
} from "../../utils";

const STATUS_META = {
  "In Progress": {
    label: "En progreso",
    className: "bg-[#4a452e] text-yellow-400",
  },
  Ready: {
    label: "Listo",
    className: "bg-[#2e4a40] text-green-400",
  },
};

const COMPLETED_STATUSES = ["Completed"];

const isCompletedStatus = (status = "") => COMPLETED_STATUSES.includes(status);

const getStatusMeta = (status = "") =>
  STATUS_META[status] ?? {
    label: status || "-",
    className: "bg-[#4a452e] text-yellow-400",
  };

const getDateParts = (timestamp) => {
  if (!timestamp) {
    return { date: "-", time: "-" };
  }

  const dateInstance = new Date(timestamp);

  return {
    date: dateInstance.toLocaleDateString("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    time: dateInstance.toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const KitchenOrders = () => {
  const queryClient = useQueryClient();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (response) => {
      const updatedOrder = response?.data?.data;

      if (isCompletedStatus(updatedOrder?.orderStatus)) {
        queryClient.setQueryData(["orders"], (previousData) => {
          if (!previousData?.data?.data) return previousData;

          const remainingOrders = previousData.data.data.filter(
            (order) => order._id !== updatedOrder._id
          );

          return {
            ...previousData,
            data: {
              ...previousData.data,
              data: remainingOrders,
            },
          };
        });
      }

      enqueueSnackbar("Estado del pedido actualizado correctamente", {
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

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Ocurrio un error al cargar los pedidos", {
      variant: "error",
    });
  }

  const orders = resData?.data?.data ?? [];
  const activeOrders = orders.filter(
    (order) =>
      !isCompletedStatus(order.orderStatus) &&
      order.orderStatus === "In Progress"
  );

  const handleStatusChange = (orderId) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus: "Ready" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#e9ecef]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-[#212529] text-2xl font-semibold">
          Pedidos de Cocina
        </h2>
      </div>
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#212529]">
            <thead className="bg-[#f8f9fa] text-[#6c757d] uppercase text-sm">
              <tr>
                <th className="p-3 font-medium">Pedido</th>
                <th className="p-3 font-medium">Cliente</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Hora</th>
                <th className="p-3 font-medium">Pedido realizado</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-[#ababab]" colSpan={6}>
                    No hay pedidos pendientes en este momento.
                  </td>
                </tr>
              ) : (
                activeOrders.map((order) => {
                  const { date, time } = getDateParts(order.orderDate);
                  const orderItems = extractOrderItems(order);
                  const statusMeta = getStatusMeta(order.orderStatus);
                  const isUpdating =
                    orderStatusUpdateMutation.isPending &&
                    orderStatusUpdateMutation.variables?.orderId === order._id;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-[#e9ecef] hover:bg-[#f8f9fa]"
                    >
                      <td className="p-4 whitespace-nowrap">
                        #{Math.floor(new Date(order.orderDate).getTime())}
                      </td>
                      <td className="p-4">
                        {order.customerDetails?.name ?? "Cliente"}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order._id)}
                          disabled={isUpdating}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            isUpdating
                              ? "bg-[#4a452e] text-yellow-400 opacity-70 cursor-not-allowed"
                              : statusMeta.className
                          } ${
                            isUpdating ? "cursor-not-allowed" : "hover:opacity-90"
                          }`}
                        >
                          {isUpdating ? "Actualizando..." : statusMeta.label}
                        </button>
                      </td>
                      <td className="p-4">{date}</td>
                      <td className="p-4">{time}</td>
                      <td className="p-4">
                        {orderItems.length === 0 ? (
                          <span className="text-sm text-[#ababab]">
                            Sin items registrados
                          </span>
                        ) : (
                          <ul className="space-y-1 text-sm text-[#212529]/80">
                            {orderItems.map((item, index) => (
                              <li key={`${order._id}-${index}`}>
                                {getOrderItemQuantity(item)} {getOrderItemLabel(item)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4 md:hidden">
        {activeOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#e9ecef] bg-[#f8f9fa] p-6 text-center text-[#ababab]">
            No hay pedidos pendientes en este momento.
          </div>
        ) : (
          activeOrders.map((order) => {
            const { date, time } = getDateParts(order.orderDate);
            const orderItems = extractOrderItems(order);
            const statusMeta = getStatusMeta(order.orderStatus);
            const isUpdating =
              orderStatusUpdateMutation.isPending &&
              orderStatusUpdateMutation.variables?.orderId === order._id;

            return (
              <div
                key={order._id}
                className="rounded-xl border border-[#e9ecef] bg-[#f8f9fa] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 text-[#212529]">
                  <p className="text-sm font-semibold">
                    Pedido #{Math.floor(new Date(order.orderDate).getTime())}
                  </p>
                  <p className="text-sm">Cliente: {order.customerDetails?.name ?? "Cliente"}</p>
                  <p className="text-sm">
                    {date} - {time}
                  </p>
                </div>
                <div className="mt-3 space-y-1 text-sm text-[#212529]/80">
                  {orderItems.length === 0 ? (
                    <span className="text-sm text-[#ababab]">
                      Sin items registrados
                    </span>
                  ) : (
                    orderItems.map((item, index) => (
                      <p key={`${order._id}-mobile-${index}`}>
                        {getOrderItemQuantity(item)} {getOrderItemLabel(item)}
                      </p>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusChange(order._id)}
                  disabled={isUpdating}
                  className={`mt-4 w-full rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    isUpdating
                      ? "bg-[#4a452e] text-yellow-400 opacity-70 cursor-not-allowed"
                      : statusMeta.className
                  } ${isUpdating ? "cursor-not-allowed" : "hover:opacity-90"}`}
                >
                  {isUpdating ? "Actualizando..." : statusMeta.label}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default KitchenOrders;
