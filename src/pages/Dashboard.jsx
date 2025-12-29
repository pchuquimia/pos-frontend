import React, { useEffect, useMemo, useState } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import TableModal from "../components/dashboard/Modal";
import AddCategoryModal from "../components/dashboard/CategoryModal";
import AddDishModal from "../components/dashboard/DishModal";
import PopularDishes from "../components/home/PopularDishes";
import { getOrders } from "../https";
import { fetchMenuCategories } from "../redux/slices/menuSlice";

const buttons = [
  { label: "Agregar Mesa", icon: <MdTableBar />, action: "table" },
  { label: "Agregar Categoria", icon: <MdCategory />, action: "category" },
  { label: "Agregar Platos", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Reporte", "Pedidos", "Platos", "Acciones"];

const filterOrdersByRange = (orders, range) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "day") {
    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getFullYear() === startOfToday.getFullYear() &&
        orderDate.getMonth() === startOfToday.getMonth() &&
        orderDate.getDate() === startOfToday.getDate()
      );
    });
  }

  if (range === "week") {
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfWeek && orderDate <= now;
    });
  }

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= startOfMonth && orderDate <= now;
  });
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const categoriesLength = useSelector((state) => state.menu.categories.length);

  useEffect(() => {
    document.title = "POS | Panel Administrativo";
  }, []);

  useEffect(() => {
    if (categoriesLength === 0) {
      dispatch(fetchMenuCategories());
    }
  }, [categoriesLength, dispatch]);

  const [activeModal, setActiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState("Reporte");
  const [reportRange, setReportRange] = useState("day");

  const { data: resData } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: () => getOrders(),
    placeholderData: (previous) => previous,
  });

  const { role } = useSelector((state) => state.user);
  const isAdmin = role === "Administrador";

  const orders = resData?.data?.data ?? [];
  const displayedTabs = isAdmin ? tabs : tabs.filter((tab) => tab !== "Acciones");

  const filteredOrders = useMemo(
    () => filterOrdersByRange(orders, reportRange),
    [orders, reportRange]
  );

  const handleOpenModal = (action) => {
    setActiveModal(action);
  };

  return (
    <div className="bg-[#F4F6FB] min-h-[calc(100vh-5rem)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#212529]">
              Panel de reportes
            </h1>
            <p className="text-sm text-[#495057]">
              Visualiza y exporta el comportamiento de ventas del restaurante.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-[#e9ecef] md:bg-transparent md:p-0 md:shadow-none md:ring-0">
            {displayedTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-[#f6b100] text-[#212529]"
                    : "bg-white text-[#212529] border border-[#dee2e6] hover:bg-[#f8f9fa]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Reporte" && (
          <>
            <Metrics
              orders={orders}
              range={reportRange}
              onRangeChange={setReportRange}
            />
            <div className="mt-8">
              <PopularDishes
                orders={filteredOrders}
                title="Platos Populares (periodo seleccionado)"
              />
            </div>
          </>
        )}

        {activeTab === "Pedidos" && (
          <div className="mt-8">
            <RecentOrders />
          </div>
        )}

        {activeTab === "Platos" && (
          <div className="mt-8">
            <PopularDishes />
          </div>
        )}

        {activeTab === "Acciones" && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buttons.map(({ label, icon, action }) => (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="bg-white border border-[#dee2e6] hover:border-[#f6b100] transition-colors px-8 py-6 rounded-2xl text-[#212529] font-semibold text-lg flex items-center justify-center gap-3"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeModal === "table" && (
        <TableModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "category" && (
        <AddCategoryModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "dishes" && (
        <AddDishModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default Dashboard;

