
type Row = {
  id: number;
  store: string;
  date: string;
  qty: number;
  price: number;
};

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data?: T[];
  columns?: Column<T>[];
  filterData:any;
  isHeaderTotal:Boolean;
};
