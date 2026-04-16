type TabKey =
  | "Sales"
  | "Other Category"
  | "Card Details"
  | "Financial";

type Props = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
};

const TABS: TabKey[] = [
  "Sales",
  "Other Category",
  "Card Details",
  "Financial",
];

export const OrderTabs = ({
  activeTab,
  setActiveTab,
}: Props) => {
  return (
    <div
      role="tablist"
      className="flex gap-1 -mb-px overflow-x-auto border-b"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-2 text-sm rounded-t-xl border transition-all whitespace-nowrap
              ${
                isActive
                  ? "bg-white border-gray-300 border-b-white text-blue-600 font-medium z-10"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};