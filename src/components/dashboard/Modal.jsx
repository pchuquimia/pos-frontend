import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../https";
import { enqueueSnackbar } from "notistack";

const TableModal = ({ onClose }) => {
  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    tableMutation.mutate(tableData);
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      onClose();
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error) => {
      const { data } = error.response ?? {};
      enqueueSnackbar(data?.message ?? "No se pudo agregar la mesa", {
        variant: "error",
      });
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1f2937]">Registrar mesa</h2>
            <p className="text-sm text-[#64748b]">
              Define el numero y la capacidad para habilitar una nueva mesa en el sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#1f2937]"
          >
            <IoMdClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[#1f2937]">Numero de mesa</label>
            <input
              type="number"
              name="tableNo"
              value={tableData.tableNo}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
              placeholder="Ej. 12"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#1f2937]">Numero de asientos</label>
            <input
              type="number"
              min="1"
              name="seats"
              value={tableData.seats}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
              placeholder="Ej. 4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#f6b100] py-2.5 text-sm font-semibold text-[#1f2937] hover:bg-[#dda108] transition-colors"
            disabled={tableMutation.isPending}
          >
            {tableMutation.isPending ? "Agregando..." : "Agregar mesa"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TableModal;
