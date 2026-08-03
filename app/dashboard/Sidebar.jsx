"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  BookOpen,
  PlusCircle,
  UserCircle2,
  Settings,
  LogOut,
  ChefHat,
  ChevronsLeft,
  ChevronsRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/token";

/* ---------------------------------------------------------
   FLAVORIZ — Dashboard Sidebar
   Light editorial system: white panel on cream canvas,
   bold Outfit wordmark, black active pill, orange accent.
--------------------------------------------------------- */

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "My Recipes", icon: BookOpen, href: "/dashboard/myrecipe" },
  { label: "Add Recipe", icon: PlusCircle, href: "/dashboard/addrecipe" },
  { label: "Category", icon: User, href: "/dashboard/category" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { token, setToken } = useAuth();
  const router = useRouter();

  return (
    <div
      className="bg-[#f7f7f7] p-4 sm:p-5 min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <aside
        className={`relative flex flex-col bg-white rounded-2xl border border-stone-200/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] h-[calc(100vh-2.5rem)] sm:h-[calc(100vh-2.5rem)] transition-all duration-300 ${
          collapsed ? "w-[84px]" : "w-72"
        }`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-stone-200 items-center justify-center text-stone-400 hover:text-stone-700 hover:border-[#ffa71c]/50 transition-colors shadow-sm z-10"
        >
          {collapsed ? <ChevronsRight size={12} /> : <ChevronsLeft size={12} />}
        </button>

        {/* Logo */}
        <div
          className={`flex items-center gap-2.5 px-5 py-6 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <Link href={"/"}>
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center shrink-0">
              <ChefHat size={17} className="text-[#ffa71c]" />
            </div>
          </Link>
          {!collapsed && (
            <span
              className="text-[17px] text-stone-900 tracking-tight whitespace-nowrap"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
            >
              FLA<span className="text-[#ffa71c]">VORIZ</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 px-3.5 space-y-1 ${collapsed ? "px-2.5" : ""}`}>
          {!collapsed && (
            <p className="px-3 pt-1 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
              Menu
            </p>
          )}
          {NAV_ITEMS.map(({ label, icon: Icon, badge, href }, index) => {
            const isActive = active === label;
            return (
              <Link href={href} key={index}>
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  title={collapsed ? label : undefined}
                  className={`group relative w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-stone-900 text-white"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={2.1}
                    className={isActive ? "text-[#ffa71c]" : ""}
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left">{label}</span>
                  )}
                  {!collapsed && badge && (
                    <span
                      className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-[#ffa71c]/15 text-[#a95f00]"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-stone-900 text-white text-[11.5px] font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {label}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`px-3.5 pb-5 pt-3 border-t border-stone-100 space-y-1 ${
            collapsed ? "px-2.5" : ""
          }`}
        >
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-stone-800 truncate">
                  Noor
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  noor@flavoriz.com
                </p>
              </div>
              <button
                onClick={async () => {
                  setToken(null);
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="text-stone-300 hover:text-red-500 transition-colors shrink-0"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <button
                className="text-red-500 hover:text-red-600 transition-colors shrink-0"
                onClick={async () => {
                  setToken(null);
                  localStorage.removeItem("token");
                  router.push("/");
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
