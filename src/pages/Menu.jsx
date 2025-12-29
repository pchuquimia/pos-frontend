import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { fetchMenuCategories } from "../redux/slices/menuSlice";
import { useDispatch, useSelector } from "react-redux";

const Menu = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);
  const categoriesLength = useSelector((state) => state.menu.categories.length);

  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  useEffect(() => {
    if (categoriesLength === 0) {
      dispatch(fetchMenuCategories());
    }
  }, [categoriesLength, dispatch]);

  return (
    <section className="bg-[#F8F9FA] min-h-[calc(100vh-5rem)] overflow-y-auto pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 xl:flex-row xl:items-start xl:gap-6">
        <div className="flex flex-col gap-4 xl:flex-[3]">
          <div className="flex flex-col gap-3 rounded-2xl bg-white/85 p-4 shadow-sm ring-1 ring-[#f1f3f5] sm:flex-row sm:items-center sm:justify-between sm:p-6 xl:bg-transparent xl:p-0 xl:shadow-none xl:ring-0">
            <div className="flex items-center gap-3">
              <BackButton />
              <h1 className="text-[#212529] text-2xl font-bold tracking-wide sm:text-3xl">
                Menu
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <MdRestaurantMenu className="text-[#212529] text-4xl sm:text-5xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md font-semibold text-[#212529]">
                  {customerData.customerName || "Nombre del cliente"}
                </h1>
                <p className="text-xs font-medium text-[#212529]">
                  Mesa: {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 shadow-sm ring-1 ring-[#f1f3f5] xl:bg-transparent xl:shadow-none xl:ring-0">
            <MenuContainer />
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#f1f3f5] sm:p-6 xl:flex-[1] xl:bg-white xl:p-6 xl:shadow-sm xl:ring-0">
          <CustomerInfo />
          <hr className="border-t border-gray-300" />
          <CartInfo />
          <Bill />
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
