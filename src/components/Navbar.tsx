"use client";

import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {
  const [dark, setDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // adjust based on your auth
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b px-4 py-3 sticky top-0 z-20">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <h1 className="text-lg font-semibold dark:text-white">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* Dark Mode */}
        {/* <button onClick={() => setDark(!dark)}>
          {dark ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="dark:text-white" />
          )}
        </button> */}

        {/* Avatar */}
        {/* <div className="w-8 h-8 bg-gray-300 rounded-full" /> */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>

      </div>
    </header>
  );
};
