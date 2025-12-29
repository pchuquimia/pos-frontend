import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createDish, removeDishById } from "../../redux/slices/menuSlice";
import { enqueueSnackbar } from "notistack";

const TYPE_OPTIONS = ["Vegetariano", "No Vegetariano", "Bebida", "Postre"];

const AddDishModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.menu.categories);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: categories[0]?.id ?? "",
    type: TYPE_OPTIONS[0],
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageData, setImageData] = useState("");

  const categoryOptions = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
      ),
    [categories]
  );

  useEffect(() => {
    if (!categories.length) return;
    setFormData((prev) => {
      const exists = categories.some(
        (category) => category.id === prev.categoryId
      );
      return exists ? prev : { ...prev, categoryId: categories[0].id };
    });
  }, [categories]);

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.categoryId
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() ?? "";
      setImagePreview(result);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.categoryId) {
      enqueueSnackbar("Selecciona una categoria", { variant: "warning" });
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      enqueueSnackbar("El plato necesita un nombre", { variant: "warning" });
      return;
    }

    const parsedPrice = Number(formData.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      enqueueSnackbar("Ingresa un precio valido", { variant: "warning" });
      return;
    }

    const image = imageData || formData.imageUrl.trim() || null;

    try {
      await dispatch(
        createDish({
          categoryId: formData.categoryId,
          name: trimmedName,
          price: parsedPrice,
          image,
          type: formData.type,
        })
      ).unwrap();

      enqueueSnackbar("Plato agregado correctamente", { variant: "success" });
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "No se pudo agregar el plato";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  const handleDeleteDish = async (dishId) => {
    const shouldRemove = window.confirm(
      "Seguro que deseas eliminar este plato?"
    );
    if (!shouldRemove) return;

    try {
      await dispatch(
        removeDishById({ categoryId: formData.categoryId, dishId })
      ).unwrap();
      enqueueSnackbar("Plato eliminado", { variant: "info" });
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "No se pudo eliminar el plato";
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
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1f2937]">
              Administrar platos
            </h2>
            <p className="text-sm text-[#64748b]">
              Registra nuevos platos, asocialos a una categoria o elimina los
              existentes.
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

        {categoryOptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8fafc] p-8 text-center text-[#64748b]">
            Aun no hay categorias. Crea una categoria antes de agregar platos.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[#1f2937]">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Creme brulee"
                  className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1f2937]">
                  Precio (Bs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1f2937]">
                  Categoria
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                  required
                >
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1f2937]">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <label className="text-sm font-medium text-[#1f2937]">
                  Imagen del plato
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-[#475569]"
                />
                <p className="text-xs text-[#94a3b8]">
                  Tambien puedes usar un enlace externo si prefieres.
                </p>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
                />
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-3 h-40 w-full overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f1f5f9]">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#f6b100] py-2.5 text-sm font-semibold text-[#1f2937] hover:bg-[#dda108] transition-colors"
              >
                Guardar plato
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#94a3b8]">
                Platos en la categoria seleccionada
              </h3>
              {selectedCategory && selectedCategory.items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#e2e8f0] bg-[#f8fafc] px-4 py-6 text-sm text-[#64748b]">
                  Esta categoria no tiene platos registrados.
                </p>
              ) : (
                <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {selectedCategory?.items.map((dish) => (
                    <li
                      key={dish.id}
                      className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fff4d6] px-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#1f2937]">
                          {dish.name}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {`Bs ${Number(dish.price).toFixed(2)} - ${dish.type}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(dish.id)}
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
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddDishModal;
