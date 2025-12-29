export const getBgColor = () => {
  const bgarr = [
    "#f6b100",
    "#f59e0b",
    "#f97316",
    "#fcd34d",
    "#fde68a",
    "#fcc5a6",
    "#f7adbc",
    "#9fd8c1",
    "#8bd6f3",
    "#b7c3d7",
  ];
  const randomBg = Math.floor(Math.random() * bgarr.length);
  const color = bgarr[randomBg];
  return color;
};

export const getAvatarName = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateAndTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const extractOrderItems = (order = {}) => {
  const candidates = [
    order?.items,
    order?.orderItems,
    order?.itemsOrdered,
    order?.cartItems,
    order?.products,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (Array.isArray(candidate)) {
      if (candidate.length > 0) {
        return candidate;
      }
      continue;
    }

    if (typeof candidate === "object") {
      const values = Object.values(candidate);
      if (values.length > 0) {
        return values;
      }
    }
  }

  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (order?.items && typeof order.items === "object") {
    return Object.values(order.items);
  }

  return [];
};

export const getOrderItemLabel = (item = {}) =>
  item?.name ||
  item?.title ||
  item?.dishName ||
  item?.productName ||
  item?.itemName ||
  item?.product?.name ||
  "Articulo";

export const getOrderItemQuantity = (item = {}) =>
  item?.quantity ??
  item?.qty ??
  item?.count ??
  item?.quantityOrdered ??
  item?.quantityRequested ??
  1;

export const countOrderItems = (order = {}) => {
  const items = extractOrderItems(order);
  if (!items.length) return 0;
  return items.reduce((sum, item) => sum + getOrderItemQuantity(item), 0);
};

const ORDER_STATUS_LABELS = {
  "In Progress": "En progreso",
  Ready: "Listo",
  Completed: "Completado",
};

export const getOrderStatusLabel = (status = "") =>
  ORDER_STATUS_LABELS[status] ?? status;

export const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;

  const a = new Date(dateA);
  const b = new Date(dateB);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const formatCurrency = (
  amount = 0,
  locale = "es-BO",
  currency = "BOB"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const formatTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeDate = (input) => {
  if (!input) return null;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const createDateRange = ({ type, start, end }) => {
  const now = new Date();
  switch (type) {
    case "day": {
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endDay = new Date(startDay);
      endDay.setDate(endDay.getDate() + 1);
      endDay.setMilliseconds(endDay.getMilliseconds() - 1);
      return { start: startDay, end: endDay };
    }
    case "week": {
      const endWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const startWeek = new Date(endWeek);
      startWeek.setDate(startWeek.getDate() - 6);
      startWeek.setHours(0, 0, 0, 0);
      return { start: startWeek, end: endWeek };
    }
    case "month": {
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      endMonth.setMilliseconds(endMonth.getMilliseconds() - 1);
      return { start: startMonth, end: endMonth };
    }
    case "custom-date": {
      const startDate = normalizeDate(start);
      const endDate = normalizeDate(end);
      if (!startDate || !endDate) return null;
      startDate.setHours(0, 0, 0, 0);
      const endOfRange = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
      return { start: startDate, end: endOfRange };
    }
    case "custom-month": {
      if (!start || !end) return null;
      const [startYear, startMonth] = start.split("-").map(Number);
      const [endYear, endMonth] = end.split("-").map(Number);
      if (
        Number.isNaN(startYear) ||
        Number.isNaN(startMonth) ||
        Number.isNaN(endYear) ||
        Number.isNaN(endMonth)
      )
        return null;
      const startDate = new Date(startYear, startMonth - 1, 1);
      const endDate = new Date(endYear, endMonth, 1);
      endDate.setMilliseconds(endDate.getMilliseconds() - 1);
      return { start: startDate, end: endDate };
    }
    case "custom-year": {
      const startYear = Number(start);
      const endYear = Number(end);
      if (Number.isNaN(startYear) || Number.isNaN(endYear)) return null;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear + 1, 0, 1);
      endDate.setMilliseconds(endDate.getMilliseconds() - 1);
      return { start: startDate, end: endDate };
    }
    default:
      return null;
  }
};


