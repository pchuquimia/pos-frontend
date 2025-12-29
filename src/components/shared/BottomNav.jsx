import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  };
  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    navigate("/tables");
    closeModal();
  };

  const baseNavItemClasses =
    "group flex w-full flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-semibold transition-colors sm:flex-row sm:py-3 sm:text-sm md:py-3 md:text-base";
  const getNavClasses = (path) =>
    `${baseNavItemClasses} ${
      isActive(path)
        ? "bg-[#FF5733] text-[#f5f5f5]"
        : "text-[#212529] hover:bg-[#f5f5f5]"
    }`;

  const createOrderDisabled = isActive("/tables") || isActive("/menu");
  const orderButtonClasses = `${baseNavItemClasses} flex-row gap-3 bg-[#212529] text-[#f5f5f5] hover:bg-[#212529]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#212529]/60`;

  return (
    <>
      {/* 🔽 Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur">
        <div
          className="mx-auto w-full max-w-5xl px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5 md:px-6 md:pb-6"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)",
          }}
        >
          <div className="grid grid-cols-1 items-stretch gap-1 sm:grid-cols-4 sm:gap-2 md:grid-cols-5 md:gap-3">
            <button
              onClick={() => navigate("/")}
              className={`${getNavClasses("/")} hidden sm:flex`}
              type="button"
            >
              <FaHome className="text-lg sm:text-xl" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className={`${getNavClasses("/orders")} hidden sm:flex`}
              type="button"
            >
              <MdOutlineReorder className="text-lg sm:text-xl" />
              <span>Pedidos</span>
            </button>
            <button
              onClick={() => navigate("/tables")}
              className={`${getNavClasses("/tables")} hidden sm:flex`}
              type="button"
            >
              <MdTableBar className="text-lg sm:text-xl" />
              <span>Mesas</span>
            </button>
            <button
              className={`${baseNavItemClasses} hidden sm:flex text-[#6c757d] hover:bg-[#f5f5f5]`}
              type="button"
            >
              <CiCircleMore className="text-lg sm:text-xl" />
              <span>Más</span>
            </button>
            <button
              disabled={createOrderDisabled}
              onClick={openModal}
              className={`${orderButtonClasses} col-span-1 sm:col-span-4 md:col-span-1`}
              aria-label="Crear orden"
              type="button"
            >
              <BiSolidDish className="text-xl sm:text-2xl" />
              <span className="uppercase">Crear orden</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 🔽 Modal FUERA del nav */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Crear Orden">
        <div>
          <label className="block text-[#212529] mb-2 text-sm font-medium">
            Nombre del cliente
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 border border-yellow-500 bg-[#FFFFFF]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Ingrese el nombre del cliente"
              className="bg-transparent flex-1 text-[#212529] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#212529]">
            Cantidad de Personas
          </label>
          <div className="flex items-center justify-between border border-yellow-500 bg-[#FFFFFF] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-[#FF5733] text-2xl">
              &minus;
            </button>
            <span className="text-[#212529]">{guestCount} Personas</span>
            <button onClick={increment} className="text-[#FF5733] text-2xl">
              &#43;
            </button>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-[#212529] rounded-lg py-3 mt-8 hover:bg-yellow-700"
        >
          Crear Orden
        </button>
      </Modal>
    </>
  );
};

export default BottomNav;
