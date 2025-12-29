import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import {
  extractOrderItems,
  getOrderItemLabel,
  getOrderItemQuantity,
  isSameDay,
} from "../../utils";

const PopularDishes = ({
  orders: providedOrders,
  title = "Platos Populares",
}) => {
  const shouldFetch = !providedOrders;

  const { data: resData } = useQuery({
    queryKey: ["orders", "popular-dishes"],
    queryFn: () => getOrders(),
    placeholderData: (previousData) => previousData,
    enabled: shouldFetch,
  });

  const orders = useMemo(() => {
    if (providedOrders) return providedOrders;
    return resData?.data?.data ?? [];
  }, [providedOrders, resData]);

  const dishes = useMemo(() => {
    const today = new Date();
    const dishMap = new Map();

    orders.forEach((order) => {
      if (!providedOrders && !isSameDay(order.orderDate, today)) return;

      const items = extractOrderItems(order);
      items.forEach((item) => {
        const name = getOrderItemLabel(item);
        const quantity = getOrderItemQuantity(item);
        dishMap.set(name, (dishMap.get(name) ?? 0) + quantity);
      });
    });

    return Array.from(dishMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [orders, providedOrders]);

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-white/85 px-4 py-5 shadow-sm ring-1 ring-[#f1f3f5] sm:px-6 sm:py-6 xl:rounded-lg xl:bg-[#FFFFFF] xl:shadow-none xl:ring-0">
        <div className="flex items-center justify-between">
          <h1 className="text-[#212529] text-lg font-semibold tracking-wide">
            {title}
          </h1>
        </div>
        <div className="mt-4 max-h-80 overflow-y-auto pr-1 scrollbar-hide sm:max-h-[26rem] xl:max-h-[680px] xl:pr-4">
          {dishes.length === 0 ? (
            <p className="px-1 text-sm text-[#212529]">
              Aun no hay platos vendidos hoy.
            </p>
          ) : (
            dishes.map((dish, index) => (
              <div
                key={dish.name}
                className="mt-4 flex items-center gap-4 rounded-[18px] bg-[#fff4d6] px-4 py-4 sm:px-6 xl:mx-0"
              >
                <span className="text-xl font-bold text-[#212529]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-[#212529] font-semibold tracking-wide">
                    {dish.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[#212529]">
                    <span className="text-[#FF5733]">Platos: </span>
                    {dish.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
