// ---------- TYPES ----------
export type Category = {
  category: string;
  qty: number;
  total: number;
};

export type Period = {
  label: string;
  categories: Category[];
  totalSale: number;
  promotion: number;
  returns: number;
  cash: number;
  upi: number;
};

export type Store = {
  storeName: string;
  weeks: Period[];
  totalSale: number;
  promotion: number;
  returns: number;
  cash: number;
  upi: number;
};

export type Mode = "day" | "week" | "month";

export type FiltersType = {
  from: string;
  to: string;
  month: string;
  year: string;
  months: string[];
};

export const PAGE_SIZE = 40;
