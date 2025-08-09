"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Table,
  Users,
  Receipt,
  Box,
  UserCog,
  BarChart,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Thống kê",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý bàn",
      href: "/tables",
      icon: Table,
    },
    {
      name: "Hội viên",
      href: "/members",
      icon: Users,
    },
    {
      name: "Hóa đơn",
      href: "/invoices",
      icon: Receipt,
    },
    {
      name: "Nhân viên",
      href: "/staff",
      icon: UserCog,
    },
    {
      name: "Kho hàng",
      href: "/inventory",
      icon: Box,
    },
    {
      name: "Báo cáo",
      href: "/reports",
      icon: BarChart,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 bg-opacity-90 backdrop-blur-md text-white h-screen flex flex-col p-6 shadow-xl border-r border-slate-800">
      <div className="flex items-center gap-3 mb-10">
        <span className="text-3xl">🎱</span>
        <h2 className="text-xl font-bold tracking-wide text-white">
          Billiard Manager
        </h2>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 pl-3 pr-4 py-2 rounded-r-full transition-all duration-300 ease-in-out cursor-pointer
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:text-white"
                }`}
              />
              <span className={`text-sm font-medium`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
