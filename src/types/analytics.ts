// ---------- TYPES ----------
export type Category = {
  name: string;
  qty: number;
  amount: number;
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
  fromDate: string;
  toDate: string;
  month: string;
  year: string;
  mode:string;
  stores: string[];
};

export const PAGE_SIZE = 40;


export type CategoryRow = {
  name: string;
  amount: number;
  qty?: number;
};

export type OtherCategoryRow = {
  name: string;
  amount: number;
  actual_qty: number;
  actual_amount: number;
  qty_diff: number;
  diff_amount: number;
  qty: number;
};