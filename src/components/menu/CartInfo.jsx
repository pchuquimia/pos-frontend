import React, { useRef, useEffect } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
      <h1 className="text-lg font-semibold tracking-wide text-[#212529]">
        Detalles de Pedido
      </h1>
      <div
        className="mt-4 max-h-72 overflow-y-auto pr-2 scrollbar-hide"
        ref={scrollRef}
      >
        {cartData.length === 0 ? (
          <p className="flex h-40 items-center justify-center text-sm font-semibold text-[#212529]">
            No hay elementos en el carrito.
          </p>
        ) : (
          cartData.map((item) => (
            <div
              key={item.id}
              className="mb-2 rounded-xl bg-white/90 px-4 py-4 shadow-sm ring-1 ring-[#f1f3f5]"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-md font-semibold tracking-wide text-[#212529]">
                  {item.name}
                </h1>
                <p className="text-xs font-semibold text-[#212529]">x{item.quantity}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => handleRemove(item.id)}
                    className="cursor-pointer text-[#FF5733]"
                    size={20}
                  />
                  <FaNotesMedical className="text-[#FF5733]" size={20} />
                </div>
                <p className="text-xs font-semibold text-[#212529]">
                  Bs {item.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;
