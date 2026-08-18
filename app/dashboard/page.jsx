"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  BookOpen,
  PlusCircle,
  Heart,
  FolderHeart,
  UserCircle2,
  Settings,
  Eye,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { t } from "@/app/il8n";

/* ---------------------------------------------------------
   FLAVORIZ — Dashboard Layout
   Light editorial system: cream canvas, white floating panels,
   Outfit display font, black active states, orange accent.
--------------------------------------------------------- */

const STATS = [
  {
    labelKey: "dashboard.stats.totalRecipes",
    value: "48",
    delta: "+4 this month",
    up: true,
    icon: BookOpen,
  },
  {
    labelKey: "dashboard.stats.totalViews",
    value: "12.4k",
    delta: "+18.2%",
    up: true,
    icon: Eye,
  },
  {
    labelKey: "dashboard.stats.avgRating",
    value: "4.8",
    delta: "+0.2",
    up: true,
    icon: Star,
  },
  {
    labelKey: "dashboard.stats.followers",
    value: "1,204",
    delta: "-2.1%",
    up: false,
    icon: Users,
  },
];

function StatCard({ labelKey, value, delta, up, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 p-5">
      <div className="flex items-start justify-between mb-4">
        <span className="w-10 h-10 rounded-xl bg-[#ffa71c]/12 flex items-center justify-center">
          <Icon size={18} className="text-[#a95f00]" />
        </span>
        <button className="text-stone-300 hover:text-stone-500 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <p
        className="text-[26px] text-stone-900 leading-none"
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
      >
        {value}
      </p>
      <p className="text-[12.5px] text-stone-400 mt-1.5">{t(labelKey)}</p>
      <div
        className={`inline-flex items-center gap-1 text-[11.5px] font-semibold mt-3 px-2 py-0.5 rounded-full ${
          up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
        }`}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {delta}
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen w-full bg-[#f7f7f7] flex rounded-md"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Main column */}
      <div className="flex-1 min-w-0 p-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
          {STATS.map((s) => (
            <StatCard key={s.labelKey} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
