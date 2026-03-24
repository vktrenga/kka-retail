"use client";

import { Menu, X, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <h1 className="text-lg font-semibold dark:text-white">Dashboard</h1>
      </div>

      <button onClick={() => setDark(!dark)}>
        {dark ? <Sun className="text-yellow-400" /> : <Moon />}
      </button>
    </header>
  );
};