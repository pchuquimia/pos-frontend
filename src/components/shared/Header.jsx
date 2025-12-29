import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const mobileMenuItems = [
    { label: "Inicio", onClick: () => handleNavigate("/") },
    { label: "Pedidos", onClick: () => handleNavigate("/orders") },
    { label: "Mesas", onClick: () => handleNavigate("/tables") },
  ];

  if (userData.role === "Administrador") {
    mobileMenuItems.push({
      label: "Dashboard",
      onClick: () => handleNavigate("/dashboard"),
    });
  }

  return (
    <header className="bg-[#FFFFF]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center justify-between gap-3 md:w-auto">
          <div
            onClick={() => handleNavigate("/")}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex items-center justify-center rounded-full border-2 border-gray-700 bg-black p-3">
              <img src={logo} alt="A pedir de boca" className="h-6 w-6" />
            </div>
            <h1 className="hidden md:block text-lg font-semibold text-[#212529]">
              A pedir de boca
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {userData.role === "Administrador" && (
              <button
                type="button"
                onClick={() => handleNavigate("/dashboard")}
                className="md:hidden rounded-[15px] bg-[#1f1f1f] p-3"
                aria-label="Ir al dashboard"
              >
                <MdDashboard className="text-[#f5f5f5] text-2xl" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-[#212529] transition hover:bg-[#f1f3f5] md:hidden"
              aria-label="Abrir men�"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-between gap-3 md:flex">
          <div className="flex w-full items-center gap-4 rounded-[15px] border border-gray-300 bg-[#FFFFF] px-4 py-2 focus-within:border-primary md:max-w-xl">
            <FaSearch className="text-[#212529]" />
            <input
              type="text"
              placeholder="Buscar"
              className="bg-surfaceMuted w-full flex-1 text-textPrimary placeholder:text-textSecondary outline-none"
            />
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            {userData.role === "Administrador" && (
              <button
                type="button"
                onClick={() => handleNavigate("/dashboard")}
                className="rounded-[15px] bg-[#1f1f1f] p-3"
              >
                <MdDashboard className="text-[#f5f5f5] text-2xl" />
              </button>
            )}
            <div className="rounded-[15px] bg-[#1f1f1f] p-3">
              <FaBell className="text-[#f5f5f5] text-2xl" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-[#212529] text-5xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-md font-semibold text-[#212529]">
                {userData.name || "TEST USER"}
              </h1>
              <p className="text-xs font-medium text-[#212529]">
                {userData.role || "Role"}
              </p>
            </div>
            <IoLogOut
              onClick={handleLogout}
              className="ml-2 text-[#212529]"
              size={40}
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="mt-3 space-y-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-[#212529] text-3xl" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#212529]">
                    {userData.name || "TEST USER"}
                  </span>
                  <span className="text-xs text-[#6c757d]">
                    {userData.role || "Role"}
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-2">
                {mobileMenuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="rounded-lg bg-[#f8f9fa] px-4 py-2 text-left text-sm font-semibold text-[#212529] transition hover:bg-[#f1f3f5]"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full rounded-lg bg-[#f6b100] px-4 py-2 text-sm font-semibold text-[#212529] transition hover:bg-[#dda108]"
              >
                Cerrar sesi�n
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
