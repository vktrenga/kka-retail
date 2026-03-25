"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Sales Data Upload", path: "/sales" },
    { name: "Sales Data Analytics", path: "/analytics" },
    // { name: "Customers", path: "/customers" },
  ];

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 z-40 bg-gray-900 text-white w-64 h-screen transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-5 text-xl font-bold border-b border-gray-700">🛍 Retail Admin</div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};