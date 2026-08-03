"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, LogOut } from "lucide-react";

/* ---------------------------------------------------------
   FLAVORIZ — Dashboard Topbar
   Light editorial system: white bar on cream canvas,
   Outfit page title, pill search, black CTA, orange accent.
--------------------------------------------------------- */

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div
      className="bg-[#f7f7f7] px-4 sm:px-5 pt-5"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <header className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] px-5 mb-4 sm:px-7 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Page title */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11.5px] text-stone-400 mb-0.5">
              <span>Flavoriz</span>
              <ChevronDown size={11} className="rotate-[-90deg]" />
              <span className="text-stone-600 font-medium">Dashboard</span>
            </div>
            <h1
              className="text-[19px] sm:text-[21px] text-stone-900 truncate"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              Good morning, Noor
              <span className="inline-block ml-1.5">👋</span>
            </h1>
          </div>
        </div>
      </header>
    </div>
  );
}
