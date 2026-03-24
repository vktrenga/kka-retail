export const OrderTabs = ({ activeTab, setActiveTab }: any) => {
  const tabs = ["Sales", "Other Category", "Card Details", "Financial"];

  return (
    <div className="flex gap-1 -mb-px overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-2 rounded-t-xl border text-sm transition-all
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
