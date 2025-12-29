import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { addItems } from "../../redux/slices/cartSlice";

const MenuContainer = () => {
  const categories = useSelector((state) => state.menu.categories);
  const dispatch = useDispatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategoryId(null);
      return;
    }

    setSelectedCategoryId((previous) => {
      if (previous && categories.some((category) => category.id === previous)) {
        return previous;
      }
      return categories[0].id;
    });
  }, [categories]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const increment = (id) => {
    setQuantities((prev) => {
      const count = prev[id] || 0;
      if (count >= 4) return prev;
      return { ...prev, [id]: count + 1 };
    });
  };

  const decrement = (id) => {
    setQuantities((prev) => {
      const count = prev[id] || 0;
      if (count <= 0) return prev;
      return { ...prev, [id]: count - 1 };
    });
  };

  const handleAddToCart = (item) => {
    const count = quantities[item.id] || 0;
    if (count === 0) return;

    dispatch(
      addItems({
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        pricePerQuantity: item.price,
        quantity: count,
        price: item.price * count,
      })
    );

    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  const renderImage = (item) => {
    if (item.image) {
      return (
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-[#fef3c7] text-[#FF5733] text-xl font-semibold">
        {item.name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)] overflow-y-auto pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/85 p-4 shadow-sm ring-1 ring-[#f1f3f5] sm:grid-cols-3 sm:p-6 lg:grid-cols-3 xl:bg-transparent xl:p-0 xl:shadow-none xl:ring-0">
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setQuantities({});
                }}
                className={`flex flex-col items-start gap-2 rounded-2xl px-4 py-4 text-left transition-all duration-200 sm:px-5 ${
                  isActive
                    ? "bg-white shadow-sm"
                    : "border border-transparent bg-white/80 hover:border-[#fde68a] hover:shadow-[0_12px_24px_rgba(246,177,0,0.12)]"
                }`}
              >
                <h1 className="flex items-center gap-2 text-lg font-bold text-[#212529]">
                  <span className="text-xl">{category.icon || "--"}</span>
                  {category.name}
                </h1>
                <p className="text-xs font-semibold text-[#212529]">
                  {category.items.length} articulos
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {selectedCategory?.items?.map((item) => {
            const count = quantities[item.id] || 0;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="mt-4 h-28 w-28 overflow-hidden rounded-full bg-[#fef9c3] shadow-inner sm:h-32 sm:w-32">
                  {renderImage(item)}
                </div>
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full items-start justify-between gap-4">
                    <div>
                      <h1 className="text-lg font-bold text-[#1f2937]">
                        {item.name}
                      </h1>
                      <p className="text-xs uppercase tracking-wide text-[#212529]">
                        {item.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="rounded-full bg-[#FFFFFF] p-2 text-[#FF5733] transition-colors hover:bg-[#fde68a]"
                      title="Agregar al pedido"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#212529]">
                        Precio
                      </p>
                      <p className="text-sm font-bold text-[#FF5733]">
                        Bs {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex w-full max-w-[160px] items-center overflow-hidden rounded-xl shadow-sm">
                      <button
                        type="button"
                        onClick={() => decrement(item.id)}
                        className="flex-1 bg-[#FF5733] py-2 text-xl font-semibold text-white transition-colors hover:bg-[#dda108]"
                      >
                        &minus;
                      </button>
                      <span className="flex-1 bg-white text-center text-lg font-bold text-[#1f2937]">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.id)}
                        className="flex-1 bg-[#FF5733] py-2 text-xl font-semibold text-white transition-colors hover:bg-[#dda108]"
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!categories.length && (
            <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white/80 text-[#64748b]">
              Aun no hay categorias disponibles. Crea una desde el dashboard.
            </div>
          )}

          {categories.length > 0 &&
            selectedCategory &&
            selectedCategory.items?.length === 0 && (
              <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white/80 text-[#64748b]">
                Esta categoria no tiene platos. Agrega uno desde el dashboard.
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default MenuContainer;
