"use client";
import React, { useState, useEffect, useTransition } from "react";
import {
  Heart,
  HeartOff,
  Star,
  Clock,
  ChefHat,
  ArrowUpRight,
} from "lucide-react";
import { t } from "@/app/il8n";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { toast } from "@/components/ui/toast";
export default function FavoriteClient({ favorites }) {
  const [isPending, startTransition] = useTransition();
  console.log(favorites);

  const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
  const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  const formatTime = (m) => {
    const n = Number(m) || 0;
    if (n < 60) return `${n} min`;
    const h = Math.floor(n / 60);
    const r = n % 60;
    return r ? `${h}h ${r}m` : `${h}h`;
  };

  const handleRemove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/recipe/${id}/favorate`);
      setTimeout(() => {
        favorites((prev) => prev.filter((r) => r._id !== id));
      }, 300);
      toast.add({
        title: "removed from favorate",
        description: "Your recipe has been removed",
        type: "success",
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
      setRemovingId(null);
    }
  };

  const showFavorate = favorites.map((favorites, index) => {
    const level =
      LEVELS[String(favorites.difficulty).trim().toLowerCase()] ?? 2;

    return (
      <article
        key={favorites._id}
        style={{ animationDelay: `${index * 70}ms` }}
        className={`fav-in group relative flex flex-col overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#FCFAF6] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(60,40,10,0.35)]`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={`http://localhost:5000/images/${encodeURIComponent(favorites.coverImage)}`}
            alt={favorites.title || "Recipe Image"}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/10" />

          {favorites.category?.name && (
            <span className="absolute start-4 top-4 rounded-full bg-[#FCFAF6]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
              {favorites.category.name}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleRemove(favorites._id)}
            title={t("favorites.removeFromFavorites")}
            aria-label={t("favorites.removeFromFavorites")}
            className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white backdrop-blur transition-all hover:scale-110 hover:bg-white hover:text-red-500"
          >
            <Heart size={15} className="fill-current" />
          </button>

          {favorites.rating ? (
            <span className="absolute bottom-3 start-4 inline-flex items-center gap-1 rounded-full bg-stone-950/55 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
              <Star size={12} className="fill-[#ffa71c] text-[#ffa71c]" />
              {Number(favorites.rating).toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className="truncate text-[19px] leading-tight text-stone-900"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {favorites.title}
          </h3>

          <div className="mt-3 flex items-center gap-4 text-[12.5px] font-medium text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-stone-400" />{" "}
              {formatTime(favorites.time)}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-[14px] items-end gap-[3px]">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{ height: 5 + i * 3 }}
                    className={`w-[4px] rounded-sm ${i <= level ? LEVEL_COLOR[level] : "bg-stone-200"}`}
                  />
                ))}
              </span>
              <span className="capitalize">{favorites.difficulty}</span>
            </span>
          </div>

          <Link
            href={`/recipedetails/${favorites._id}`}
            className="group/cta mt-5 flex items-center justify-between rounded-full bg-stone-900 py-1.5 ps-5 pe-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            {t("recipes.seeCompleteRecipe")}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffa71c] text-stone-900 transition-transform group-hover/cta:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </article>
    );
  });

  function EmptyState() {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-stone-300 bg-[#FCFAF6] px-6 py-20 text-center sm:py-28">
        <span className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#ffa71c]/15 ring-8 ring-[#ffa71c]/5">
          <HeartOff size={30} className="text-[#a95f00]" />
        </span>
        <h3
          className="mb-2 text-[26px] text-stone-900"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          {t("favorites.emptyTitle")}
        </h3>
        <p className="mb-7 max-w-xs text-[14px] leading-relaxed text-stone-500">
          {t("favorites.emptyDescription")}
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
        >
          <ChefHat size={16} className="text-[#ffa71c]" />{" "}
          {t("favorites.browseRecipes")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-[#F6F2EA] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`@keyframes favIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}.fav-in{animation:favIn .55s cubic-bezier(.2,.7,.2,1) both}`}</style>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <h1
              className="text-[40px] leading-none text-stone-900 sm:text-[52px]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {t("favorites.title")}
            </h1>
            <p className="mt-3 text-[14px] text-stone-500">
              {favorites.length > 0
                ? t("favorites.savedRecipes", { count: favorites.length })
                : t("favorites.emptyMessage")}
            </p>
          </div>
          {favorites.length > 0 && (
            <span
              className="flex h-16 min-w-16 items-center justify-center rounded-full bg-stone-900 px-5 text-[28px] text-[#ffa71c]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {favorites.length}
            </span>
          )}
        </header>

        {isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showFavorate}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
