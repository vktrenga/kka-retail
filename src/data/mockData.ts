import { Mode,Category, Period, Store, FiltersType} from "@/types/analytics";

export const PAGE_SIZE = 40;

export const generateCategories = (): Category[] =>
  Array.from({ length: 200 }, (_, c) => {
    const qty = Math.floor(Math.random() * 50) + 1;
    const total = qty * (Math.floor(Math.random() * 200) + 50);
    return { category: `Category ${c + 1}`, qty, total };
});

export const createPeriod = (label: string): Period => {
  const categories = generateCategories();
  const totalSale = categories.reduce((s, c) => s + c.total, 0);
  const promotion = Math.floor(totalSale * 0.1);
  const returns = Math.floor(totalSale * 0.05);
  const net = totalSale - promotion - returns;

  return {
    label,
    categories,
    totalSale,
    promotion,
    returns,
    cash: Math.floor(net * 0.3),
    upi: Math.floor(net * 0.4),
  };
};

export const stores: Store[] = Array.from({ length: 10 }, (_, i) => {
  const weeks = Array.from({ length: 4 }, (_, w) =>
    createPeriod(`W${w + 1}`)
  );

  const totalSale = weeks.reduce((s, w) => s + w.totalSale, 0);
  const promotion = weeks.reduce((s, w) => s + w.promotion, 0);
  const returns = weeks.reduce((s, w) => s + w.returns, 0);
  const net = totalSale - promotion - returns;

  return {
    storeName: `Store ${i + 1}`,
    weeks,
    totalSale,
    promotion,
    returns,
    cash: Math.floor(net * 0.3),
    upi: Math.floor(net * 0.4),
  };
});
