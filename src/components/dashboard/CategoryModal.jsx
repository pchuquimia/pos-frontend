import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  removeCategoryById,
} from "../../redux/slices/menuSlice";
import { enqueueSnackbar } from "notistack";

const ACCENT_COLORS = ["#f6b100", "#f4c152", "#f2a007", "#f59e0b", "#fcd34d"];
const getRandomColor = () =>
  ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];

const AddCategoryModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.menu.categories);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    bgColor: getRandomColor(),
  });

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
      ),
    [categories]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      enqueueSnackbar("La categoria necesita un nombre", {
        variant: "warning",
      });
      return;
    }

    try {
      await dispatch(
        createCategory({
          name: trimmedName,
          bgColor: formData.bgColor,
          icon: formData.icon.trim(),
        })
      ).unwrap();
      enqueueSnackbar("Categoria creada correctamente", { variant: "success" });
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "No se pudo crear la categoria";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;

    const hasItems = category.items.length > 0;
    const shouldRemove = window.confirm(
      hasItems
        ? "Esta categoria tiene platos asociados. Se eliminaran tambien. Deseas continuar?"
        : "Seguro que deseas eliminar esta categoria?"
    );

    if (!shouldRemove) return;

    try {
      await dispatch(removeCategoryById(categoryId)).unwrap();
      enqueueSnackbar("Categoria eliminada", { variant: "info" });
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "No se pudo eliminar la categoria";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1f2937]">
              Administrar categorias
            </h2>
            <p className="text-sm text-[#64748b]">
              Agrega nuevas categorias o elimina las que ya no necesites.
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
            <label className="text-sm font-medium text-[#1f2937]">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Postres"
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#1f2937]">
              Icono (emoji u opcion corta)
            </label>
            <input
              type="text"
              name="icon"
              maxLength={3}
              value={formData.icon}
              onChange={handleChange}
              placeholder="Ej. (emoji)"
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#1f2937]">
              Color destacado
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleChange}
                className="h-10 w-16 cursor-pointer rounded-lg border border-[#e2e8f0]"
              />
              <span className="text-sm text-[#475569]">{formData.bgColor}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#f6b100] py-2.5 text-sm font-semibold text-[#1f2937] hover:bg-[#dda108] transition-colors"
          >
            Guardar categoria
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#94a3b8]">
            Categorias existentes
          </h3>
          {sortedCategories.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-center text-sm text-[#64748b]">
              Aun no tienes categorias registradas.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {sortedCategories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fff4d6] px-4 py-2"
                >
                  <span className="text-sm font-medium text-[#1f2937]">
                    {category.icon ? `${category.icon} ` : ""}
                    {category.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center gap-1 rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-semibold text-[#b91c1c] hover:bg-[#fecaca] transition-colors"
                  >
                    <FiTrash2 />
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddCategoryModal;
