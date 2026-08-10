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
  Star,
  Clock,
  Gauge,
  HeartOff,
  ChefHat,
} from "lucide-react";
import { t, useI18n } from "@/app/il8n";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { de, fa, id } from "zod/locales";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { toast } from "@/components/ui/toast";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "My Recipes", icon: BookOpen },
  { label: "Add Recipe", icon: PlusCircle },
  { label: "Favorites", icon: Heart, active: true },
  { label: "Collections", icon: FolderHeart },
  { label: "Profile", icon: UserCircle2 },
  { label: "Settings", icon: Settings },
];

const INITIAL_FAVORITES = [
  {
    id: 1,
    title: "Creamy Chicken Pasta",
    category: "Pasta",
    time: "20 min",
    difficulty: "Easy",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Avocado Salad",
    category: "Salad",
    time: "15 min",
    difficulty: "Easy",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Grilled Salmon",
    category: "Seafood",
    time: "25 min",
    difficulty: "Medium",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Fluffy Pancakes",
    category: "Breakfast",
    time: "20 min",
    difficulty: "Easy",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500&auto=format&fit=crop",
  },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 sm:py-28">
      <span className="inline-flex w-16 h-16 rounded-full bg-[#ffa71c]/12 items-center justify-center mb-5">
        <HeartOff size={26} className="text-[#a95f00]" />
      </span>
      <h3
        className="text-[19px] text-stone-900 mb-2"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {t("favorites.emptyTitle")}
      </h3>
      <p className="text-stone-500 text-[13.5px] max-w-xs mb-6">
        {t("favorites.emptyDescription")}
      </p>
      <Link href={"/recipes"}>
        <button className="inline-flex items-center gap-1.5 bg-[#ffa71c] text-stone-900 text-[13.5px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#ff9c00] shadow-[0_8px_20px_-8px_rgba(255,167,28,0.6)] transition-colors">
          <ChefHat size={15} /> {t("favorites.browseRecipes")}
        </button>
      </Link>
    </div>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [favorateRecipe, setFavorte] = useState([]);
  const [load, setLoad] = useState(false);
  const [render, setRender] = useState(false);
  const { language } = useI18n();

  useEffect(() => {
    setLoad(true);
    async function fetchRecipe() {
      try {
        await axios
          .get(`http://localhost:5000/api/v1/recipe/favorate`)
          .then((res) => {
            console.log(res.data);
            setFavorte(res.data);
          });
        setLoad(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    }
    fetchRecipe();
  }, [render]);

  const handleRemove = async (id) => {
    try {
      await axios
        .patch(`http://localhost:5000/api/v1/recipe/${id}/favorate`)
        .then((res) => {
          console.log(res.data);
          setRender((prev) => !prev);
        });
      toast.add({
        title: "removed from favorate",
        description: "Your recipe has been removed",
        type: "success",
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showFavorate = favorateRecipe.map((favrecipe) => {
    return (
      <div
        key={favrecipe._id}
        className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.15)] transition-shadow"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={`http://localhost:5000/images/${encodeURIComponent(favrecipe.coverImage)}`}
            alt={favrecipe.title}
            fill
            unoptimized
            className="h-full w-full object-cover"
            loading="eager"
          />
          <span className="absolute top-3 left-3 text-[11px] font-semibold text-stone-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">
            {favrecipe.category}
          </span>
          <button
            onClick={() => handleRemove(favrecipe._id)}
            title={t("favorites.removeFromFavorites")}
            className="absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center text-[white] hover:bg-white/90 hover:text-orange-300 bg-red-500  transition-colors"
          >
            <Heart size={14} className="fill-current" />
          </button>
        </div>

        <div className="p-4">
          <h3
            className="text-[16px] text-stone-900 mb-2 truncate"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {favrecipe.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-stone-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {favrecipe.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Gauge size={12} /> {favrecipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="text-[#ffa71c] fill-[#ffa71c]" />
              {favrecipe.rating}
            </span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className="min-h-screen w-full bg-[#f7f7f7] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex">
        <div className="flex-1 min-w-0">
          <main className="px-6 lg:px-10 py-8 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h1
                  className="text-[28px] text-stone-900"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {t("favorites.title")}
                </h1>
                <p className="text-stone-500 text-[14px] mt-1">
                  {favorateRecipe.length > 0
                    ? t("favorites.savedRecipes", {
                        count: favorateRecipe.length,
                      })
                    : t("favorites.emptyMessage")}
                </p>
              </div>
            </div>

            {favorateRecipe.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {showFavorate}
              </div>
            ) : load == true ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
