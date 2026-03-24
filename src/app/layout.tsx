"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import "@/styles/globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
<body className="flex bg-gray-100 dark:bg-gray-900 h-screen overflow-hidden  gap-4 p-4">
        {/* Sidebar */}
        {!isLoginPage && (
          <Sidebar open={open} setOpen={setOpen} />
        )}

<div className="flex-1 flex flex-col min-h-screen overflow-hidden  gap-4 p-4">
          {/* Navbar */}
          {!isLoginPage && (
            <Navbar open={open} setOpen={setOpen} />
          )}

          {/* Content */}
          <main className={isLoginPage ? "" : "p-p-4 overflow-auto"}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
