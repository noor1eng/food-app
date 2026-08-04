"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut, Languages } from "lucide-react";
import Link from "next/link";
import Logout from "./(auth)/Logout";
import { useAuth } from "./context/token";

/* ---------------------------------------------------------
   FLAVORIZ — Navbar
   Clean editorial nav: white canvas, bold geometric wordmark.
   Right cluster swaps between Sign In / Sign Up (guest) and
   Dashboard / Logout (authenticated). Fully responsive.
   --------------------------------------------------------- */

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Recipes", href: "/recipes" },
  { label: "Favorites", href: "/favorites" },
];

export default function Navbar() {
  const { token } = useAuth();
  console.log(token);
  const [lang, setLang] = useState("en");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  return (
    <div
      className="w-full bg-[#f7f7f7]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <header className="relative z-30 bg-white/90 backdrop-blur border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[70px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href={"/"}
            className="text-[19px] tracking-tight text-stone-900 shrink-0"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
          >
            FLA<span className="text-[#ffa71c]">VORIZ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map(({ label, active, href }) => (
              <Link
                key={label}
                href={href}
                className={`relative px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors rounded-full ${
                  active
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {token ? (
              <>
                {/* Authenticated state */}
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-stone-600 hover:text-stone-900 px-3.5 py-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>

                <Logout />

                {/* Compact profile trigger for small screens */}
                <button
                  className="sm:hidden w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#ffa71c]/40 shrink-0"
                  aria-label="Account menu"
                >
                  <img
                    src="https://i.pravatar.cc/64?img=13"
                    className="w-full h-full object-cover"
                    alt="Account"
                  />
                </button>
              </>
            ) : (
              <>
                {/* Guest state */}
                <Link href={"/login"}>
                  <button className="hidden sm:inline-flex items-center text-[13px] font-semibold text-stone-600 hover:text-stone-900 px-3.5 py-2 rounded-full hover:bg-stone-100 transition-colors">
                    Sign In
                  </button>
                </Link>

                <Link href={"/register"}>
                  <button className="inline-flex items-center gap-1.5 bg-[#ffa71c] text-stone-900 text-[13px] font-semibold px-4 sm:px-5 py-2 rounded-full hover:bg-[#ff9c00] shadow-[0_8px_18px_-8px_rgba(255,167,28,0.6)] transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden w-9 h-9 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center shrink-0"
              aria-label="Menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-stone-100 ${
            open ? "max-h-[26rem]" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col px-5 py-3">
            {LINKS.map(({ label, active }) => (
              <Link
                key={label}
                href="#"
                className={`py-3 text-[14px] font-semibold uppercase tracking-wide border-b border-stone-100 flex items-center justify-between ${
                  active ? "text-stone-900" : "text-stone-400"
                }`}
              >
                {label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffa71c]" />
                )}
              </Link>
            ))}

            {/* Auth actions — mobile */}
            <div className="pb-2">
              {token ? (
                // ── Logged in ──────────────────────────────────
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
                    <img
                      src="https://i.pravatar.cc/64?img=13"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#ffa71c]/40 shrink-0"
                      alt="Account"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-stone-800 truncate leading-tight">
                        Noor Al-Amin
                      </p>
                      <Link
                        href="#"
                        className="text-[11.5px] text-stone-400 inline-flex items-center gap-1 hover:text-stone-600 transition-colors"
                      >
                        <LayoutDashboard size={11} />
                        Dashboard
                      </Link>
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-1.5 bg-stone-900 text-white text-[12.5px] font-semibold px-3.5 py-2 rounded-full hover:bg-black transition-colors shrink-0">
                    <LogOut size={13} />
                    Logout
                  </button>
                </div>
              ) : (
                // ── Guest ──────────────────────────────────────
                <div className="flex items-center gap-2">
                  {/* زر الترجمة */}
                  <button
                    onClick={() => setLang(lang === "en" ? "ar" : "en")}
                    className="inline-flex items-center gap-1.5 border border-stone-200 text-stone-500 text-[12px] font-semibold px-3 py-2 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors shrink-0"
                    aria-label="Toggle language"
                  >
                    <Languages size={14} className="text-stone-400" />
                    <span>{lang === "en" ? "EN" : "AR"}</span>
                  </button>

                  {/* Sign In */}
                  <Link href="/login" className="flex-1 min-w-0">
                    <button className="w-full rounded-full border border-stone-200 text-stone-700 text-[13px] font-semibold py-2.5 px-4 hover:bg-stone-50 transition-colors whitespace-nowrap">
                      Sign In
                    </button>
                  </Link>

                  {/* Sign Up */}
                  <Link href="/register" className="flex-1 min-w-0">
                    <button className="w-full rounded-full bg-[#ffa71c] text-stone-900 text-[13px] font-semibold py-2.5 px-4 hover:bg-[#ff9c00] transition-colors whitespace-nowrap">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
