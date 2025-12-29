import React, { useMemo } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import Minicard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";
import { countOrderItems, formatCurrency, isSameDay } from "../utils";

const Home = () => {
  const { role } = useSelector((state) => state.user);
  const isCashier = role === "Cajero";

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    placeholderData: (previousData) => previousData,
    enabled: !isCashier,
  });

  const { totalSales, dishesSold } = useMemo(() => {
    if (isCashier) {
      return { totalSales: 0, dishesSold: 0 };
    }

    const orders = resData?.data?.data ?? [];
    const today = new Date();

    const todaysOrders = orders.filter((order) =>
      isSameDay(order.orderDate, today)
    );

    const sales = todaysOrders.reduce(
      (sum, order) => sum + Number(order?.bills?.totalWithTax ?? 0),
      0
    );

    const dishes = todaysOrders.reduce(
      (sum, order) => sum + countOrderItems(order),
      0
    );

    return { totalSales: sales, dishesSold: dishes };
  }, [isCashier, resData]);

  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)] overflow-hidden pb-20 xl:pb-0">
      {isCashier ? (
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 xl:flex-row xl:items-stretch xl:gap-3 xl:px-8 xl:py-8">
          <div className="flex flex-1 flex-col gap-6 xl:gap-8">
            <Greetings />
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6 xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none">
              <RecentOrders />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 xl:flex-row xl:gap-3 xl:px-8 xl:py-8">
          <div className="flex flex-col gap-6 xl:flex-[3] xl:gap-8">
            <Greetings />
            <div className="mt-2 grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm sm:grid-cols-2 sm:p-6 xl:mt-8 xl:flex xl:flex-row xl:items-center xl:gap-3 xl:rounded-none xl:bg-transparent xl:p-0 xl:px-8 xl:shadow-none">
              <Minicard
                title="Ganancias Totales"
                icon={<BsCashCoin />}
                value={formatCurrency(totalSales)}
                caption="Ventas registradas hoy"
              />
              <Minicard
                title="Platos Vendidos"
                icon={<GrInProgress />}
                value={`${dishesSold} `}
                caption="Platos vendidos hoy"
              />
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6 xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none">
              <RecentOrders />
            </div>
          </div>

          <div className="flex flex-col gap-6 xl:flex-[2] xl:gap-8">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6 xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none">
              <PopularDishes />
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </section>
  );
};

export default Home;
