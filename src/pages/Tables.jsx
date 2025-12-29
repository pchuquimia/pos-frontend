import React, { useMemo, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getTables, updateOrderStatus, updateTable } from "../https";
import { enqueueSnackbar } from "notistack";

const filters = [
  { key: "all", label: "Todos" },
  { key: "booked", label: "Ocupado" },
  { key: "available", label: "Disponible" },
];

const matchesFilter = (status = "", filterKey) => {
  const normalizedStatus = status.toLowerCase();

  switch (filterKey) {
    case "booked":
      return normalizedStatus === "booked";
    case "available":
      return normalizedStatus === "available";
    default:
      return true;
  }
};

const Tables = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => getTables(),
    placeholderData: keepPreviousData,
  });

  const releaseTableMutation = useMutation({
    mutationFn: async ({ tableId, orderId }) => {
      await updateOrderStatus({ orderId, orderStatus: "Completed" });
      await updateTable({ tableId, status: "Available", orderId: null });
    },
    onSuccess: () => {
      enqueueSnackbar("Mesa liberada correctamente", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("No se pudo liberar la mesa", { variant: "error" });
    },
  });

  const handleReleaseTable = (table) => {
    const orderId = table.currentOrder?._id;

    if (!orderId) {
      enqueueSnackbar("Esta mesa no tiene un pedido asociado.", {
        variant: "warning",
      });
      return;
    }

    releaseTableMutation.mutate({ tableId: table._id, orderId });
  };

  if (isError) {
    enqueueSnackbar("Ocurrio un error", { variant: "error" });
  }

  const tables = resData?.data?.data ?? [];
  const filteredTables = tables.filter((table) =>
    matchesFilter(table.status, statusFilter)
  );

  const totalTables = tables.length;
  const bookedTables = useMemo(
    () =>
      tables.filter((table) => table.status?.toLowerCase() === "booked").length,
    [tables]
  );
  const availableTables = totalTables - bookedTables;

  const releasingTableId = releaseTableMutation.variables?.tableId;

  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 pb-28 space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <BackButton />
            <div>
              <h1 className="text-3xl font-semibold text-[#1f2937]">Mesas</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: "Totales", value: totalTables },
              { label: "Ocupadas", value: bookedTables },
              { label: "Disponibles", value: availableTables },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex h-16 w-20 flex-col items-center justify-center rounded-2xl  bg-white/90 text-[#1f2937] shadow-sm"
              >
                <span className="text-xs font-medium text-[#212529]">
                  {label}
                </span>
                <span className="text-lg font-semibold text-[#1f2937]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl  bg-white/90 px-4 py-4 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {filters.map(({ key, label }) => {
              const isActive = statusFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#f6b100] text-[#1f2937] shadow-sm"
                      : "bg-white text-[#475569] border border-[#f6b100]/20 hover:border-[#f6b100]/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid max-h-[calc(100vh-20rem)] grid-cols-1 gap-6 overflow-y-auto pr-1 scrollbar-hide sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <TableCard
                key={table._id}
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={table.currentOrder?.customerDetails?.name}
                seats={table.seats}
                orderStatus={table.currentOrder?.orderStatus}
                onRelease={
                  table.status?.toLowerCase() === "booked"
                    ? () => handleReleaseTable(table)
                    : undefined
                }
                isReleasing={
                  releaseTableMutation.isPending &&
                  releasingTableId === table._id
                }
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[#f6b100]/40 bg-white/80 py-14 text-center text-[#212529]">
              No hay mesas para mostrar
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </section>
  );
};

export default Tables;
