import React, { useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getOrders, updateOrderStatus, updateTable } from "../https/index";
import { enqueueSnackbar } from "notistack";
import KitchenOrders from "../components/orders/KitchenOrders";
import Greetings from "../components/home/Greetings";
import { useSelector } from "react-redux";

const KitchenOrdersPage = () => {
  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)] overflow-y-auto pb-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <Greetings />
        <KitchenOrders />
      </div>
    </section>
  );
};

const filters = [
  { key: "all", label: "Todos" },
  { key: "progress", label: "En progreso" },
  { key: "ready", label: "Listos" },
  { key: "completed", label: "Completados" },
];

const statusMatchesFilter = (orderStatus = "", filterKey) => {
  const normalizedStatus = orderStatus.toLowerCase();

  switch (filterKey) {
    case "progress":
      return (
        normalizedStatus === "in progress" || normalizedStatus === "progress"
      );
    case "ready":
      return normalizedStatus === "ready";
    case "completed":
      return normalizedStatus === "completed";
    default:
      return true;
  }
};

const OrdersListPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { role } = useSelector((state) => state.user);
  const isCashier = role === "Cajero";
  const queryClient = useQueryClient();

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
    placeholderData: keepPreviousData,
  });

  const completeOrderMutation = useMutation({
    mutationFn: async (order) => {
      const response = await updateOrderStatus({
        orderId: order._id,
        orderStatus: "Completed",
      });

      if (order?.table?._id) {
        await updateTable({
          tableId: order.table._id,
          status: "Available",
          orderId: null,
        });
      }

      return response;
    },
    onSuccess: () => {
      enqueueSnackbar("Pedido actualizado correctamente", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("No se pudo actualizar el estado del pedido", {
        variant: "error",
      });
    },
  });

  if (isError) {
    enqueueSnackbar("Ocurrio un error", { variant: "error" });
  }

  const orders = resData?.data?.data ?? [];
  const filteredOrders = orders.filter((order) =>
    statusMatchesFilter(order.orderStatus, statusFilter)
  );

  const handleMarkAsCompleted = (order) => {
    completeOrderMutation.mutate(order);
  };

  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)] overflow-hidden pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#212529] text-2xl font-bold tracking-wide sm:text-3xl">
              Mis Pedidos
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-[#f1f3f5] lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  statusFilter === key
                    ? "bg-[#f6b100] text-[#212529]"
                    : "text-[#212529]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                canComplete={isCashier}
                onComplete={handleMarkAsCompleted}
                isCompleting={
                  completeOrderMutation.isPending &&
                  completeOrderMutation.variables?._id === order._id
                }
              />
            ))
          ) : (
            <p className="text-gray-500">No hay pedidos disponibles</p>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

const Orders = () => {
  const { role } = useSelector((state) => state.user);
  const isKitchen = role === "Cocina";

  useEffect(() => {
    document.title = isKitchen ? "POS | Cocina" : "POS | Pedidos";
  }, [isKitchen]);

  return isKitchen ? <KitchenOrdersPage /> : <OrdersListPage />;
};

export default Orders;
