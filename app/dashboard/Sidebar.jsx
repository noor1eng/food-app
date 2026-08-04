"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  BookOpen,
  PlusCircle,
  LogOut,
  ChefHat,
  ChevronsLeft,
  ChevronsRight,
  User,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const { token, setToken } = useAuth();
  const router = useRouter();

  return (
    <>
      {/* Mobile trigger — always visible below lg, fixed to the viewport */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-white border border-stone-200/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] flex items-center justify-center text-stone-700"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop — only on mobile, only while open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Wrapper — no padding on mobile so the drawer sits flush */}
      <div
        className="lg:bg-[#f7f7f7] lg:p-4 sm:lg:p-5 lg:min-h-screen"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <aside
          className={`flex flex-col bg-white border border-stone-200/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] transition-all duration-300
            fixed inset-y-0 left-0 z-50 w-72 rounded-none
            lg:static lg:z-auto lg:rounded-2xl lg:h-[calc(100vh-2.5rem)]
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            ${collapsed ? "lg:w-[84px]" : "lg:w-72"}
          `}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
            aria-label="Close menu"
          >
            <X size={15} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-stone-200 items-center justify-center text-stone-400 hover:text-stone-700 hover:border-[#ffa71c]/50 transition-colors shadow-sm z-10"
          >
            {collapsed ? (
              <ChevronsRight size={12} />
            ) : (
              <ChevronsLeft size={12} />
            )}
          </button>

          {/* Logo */}
          <div
            className={`flex items-center gap-2.5 px-5 py-6 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <Link href={"/"}>
              <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center shrink-0">
                <ChefHat size={17} className="text-[#ffa71c]" />
              </div>
            </Link>
            <span
              className={`text-[17px] text-stone-900 tracking-tight whitespace-nowrap ${
                collapsed ? "lg:hidden" : ""
              }`}
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
            >
              FLA<span className="text-[#ffa71c]">VORIZ</span>
            </span>
          </div>

          {/* Nav */}
          <nav
            className={`flex-1 min-h-0  px-3.5 space-y-1 ${
              collapsed ? "lg:px-2.5" : ""
            }`}
          >
            <p
              className={`px-3 pt-1 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Menu
            </p>
            {NAV_ITEMS.map(({ label, icon: Icon, badge, href }, index) => {
              const isActive = active === label;
              return (
                <Link
                  href={href}
                  key={index}
                  onClick={() => setMobileOpen(false)}
                >
                  <button
                    onClick={() => setActive(label)}
                    title={collapsed ? label : undefined}
                    className={`group relative w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                      collapsed ? "lg:justify-center lg:px-0" : ""
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
                    <span
                      className={`flex-1 text-left ${collapsed ? "lg:hidden" : ""}`}
                    >
                      {label}
                    </span>
                    {badge && (
                      <span
                        className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full ${
                          collapsed ? "lg:hidden" : ""
                        } ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-[#ffa71c]/15 text-[#a95f00]"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {collapsed && (
                      <span className="pointer-events-none hidden lg:block absolute left-full ml-2 whitespace-nowrap rounded-lg bg-stone-900 text-white text-[11.5px] font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
            className={`px-3.5 pb-5 pt-3 border-t border-stone-100 space-y-1 shrink-0 ${
              collapsed ? "lg:px-2.5" : ""
            }`}
          >
            <div
              className={`flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer ${
                collapsed ? "lg:justify-center" : ""
              }`}
            >
              <div className={`flex-1 min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
                <p className="text-[13px] font-semibold text-stone-800 truncate">
                  Noor
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  noor@flavoriz.com
                </p>
              </div>
              <button
                // onClick={handleLogout}
                className="text-stone-300 hover:text-red-500 transition-colors shrink-0"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
