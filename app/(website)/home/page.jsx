"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  ChefHat,
  Salad,
  Soup,
  Sandwich,
  Leaf,
  Globe2,
  IceCreamCone,
  HeartPulse,
  Zap,
  ArrowUpRight,
  Plus,
  Clock,
  ListChecks,
} from "lucide-react";
import Navbar from "../../Navbar";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/context/token";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { t, useI18n } from "@/app/il8n";

const CATEGORIES = [
  {
    value: "all",
    labelKey: "recipes.filters.allTypes",
    icon: ChefHat,
    active: true,
  },
  {
    value: "appetizers",
    labelKey: "recipes.filters.appetizers",
    icon: Sandwich,
  },
  { value: "mainCourses", labelKey: "recipes.filters.mainCourses", icon: Soup },
  {
    value: "saladsSides",
    labelKey: "recipes.filters.saladsSides",
    icon: Salad,
  },
  { value: "vegetarian", labelKey: "recipes.filters.vegetarian", icon: Leaf },
  {
    value: "international",
    labelKey: "recipes.filters.international",
    icon: Globe2,
  },
  {
    value: "desserts",
    labelKey: "recipes.filters.desserts",
    icon: IceCreamCone,
  },
  {
    value: "healthyEats",
    labelKey: "recipes.filters.healthyEats",
    icon: HeartPulse,
  },
  { value: "quickEasy", labelKey: "recipes.filters.quickEasy", icon: Zap },
];

// const RECIPES = [
//   {
//     title: "Fresh Salad with Tahini Sauce",
//     views: "250+",
//     img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
//   },
//   {
//     title: "Chili con Carne with Nachos Chips",
//     views: "150+",
//     img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop",
//   },
//   {
//     title: "Sour & Spicy Korean Kimchi",
//     views: "200+",
//     img: "https://images.unsplash.com/photo-1583224964978-2257b960c3d6?q=80&w=600&auto=format&fit=crop",
//   },
//   {
//     title: "Flat Noodles with Shrimp Veggie",
//     views: "200+",
//     img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
//   },
//   {
//     title: "Cauliflower Steak Chimichurri Spices",
//     views: "150+",
//     img: "https://images.unsplash.com/photo-1540420773420-4d0c2a6e6dc8?q=80&w=600&auto=format&fit=crop",
//   },
// ];

export default function Hero() {
  const [active, setActive] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [load, setLoad] = useState(false);
  const { token } = useAuth();
  const { language, changeLanguage } = useI18n();
  console.log(language);

  // / easy / medium / hard  ->  1 / 2 / 3
  const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
  const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  useEffect(() => {
    setLoad(true);
    async function fetchRecipes() {
      await axios.get("http://localhost:5000/api/v1/recipe").then((res) => {
        setRecipes(res.data);
        setLoad(false);
      });
    }
    fetchRecipes();
  }, []);

  const showRecipes = recipes.map((recipe) => {
    const level = LEVELS[String(recipe.difficulty).trim().toLowerCase()] ?? 2;
    const categoryName = recipe.category?.name;
    return (
      <article
        key={recipe._id}
        className="group relative flex flex-col overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#FCFAF6] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(60,40,10,0.35)]"
      >
        {/* ───── Cover ───── */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={`http://localhost:5000/images/${encodeURIComponent(recipe.coverImage)}`}
            alt={recipe.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/10" />

          {/* category */}
          {categoryName && (
            <span className="absolute start-4 top-4 rounded-full bg-[#FCFAF6]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
              {categoryName}
            </span>
          )}

          {/* rating + photos */}
          <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
            {recipe.rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/55 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
                <Star size={12} className="fill-[#ffa71c] text-[#ffa71c]" />
                {Number(recipe.rating).toFixed(1)}
              </span>
            ) : (
              <span />
            )}
            {recipe.images?.length > 0 && (
              <span>
                <Image size={12} />+{recipe.images.length}
              </span>
            )}
          </div>
        </div>

        {/* ───── Body ───── */}
        <div className="flex flex-1 flex-col p-5">
          <h3
            className="truncate text-[19px] leading-tight text-stone-900"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {recipe.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-[2.6rem] text-[13px] leading-[1.35rem] text-stone-500">
            {recipe.description}
          </p>

          {/* meta strip */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white py-2.5 rtl:divide-x-reverse">
            <div className="flex flex-col items-center gap-0.5">
              <Clock size={14} className="text-stone-400" />
              <span className="text-[12px] font-semibold text-stone-800">
                {recipe.time} min
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex h-[14px] items-end gap-[3px]">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{ height: 5 + i * 3 }}
                    className={`w-[4px] rounded-sm ${i <= level ? LEVEL_COLOR[level] : "bg-stone-200"}`}
                  />
                ))}
              </div>
              <span className="text-[12px] font-semibold capitalize text-stone-800">
                {recipe.difficulty}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <ListChecks size={14} className="text-stone-400" />
              <span className="text-[12px] font-semibold text-stone-800">
                {recipe.ingredient} items
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-5">
            <Link
              href={`/recipedetails/${recipe._id}`}
              className="group/cta flex items-center justify-between rounded-full bg-stone-900 py-1.5 ps-5 pe-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
            >
              {t("recipes.seeCompleteRecipe")}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffa71c] text-stone-900 transition-transform group-hover/cta:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </article>
    );
  });

  return (
    <>
      <Navbar />
      <div
        className="w-full bg-[#f7f7f7]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* Hero banner */}
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#eef1ea] to-[#e4e8de] min-h-[220px] sm:min-h-[260px] flex items-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 px-7 sm:px-12 py-10 max-w-[55%] sm:max-w-[45%]">
              <h1
                className="text-[26px] sm:text-[38px] leading-[1.1] text-stone-900"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
              >
                {t("home.title")}
              </h1>
              <Link href={token ? "/dashboard/addrecipe" : "/register"}>
                <button className="flex justify-center items-center mt-5 gap-1.5 bg-stone-800 text-white text-[10.5px] lg:text-[12.5px] font-semibold pl-3.5 pr-4 py-2.5 rounded-full hover:bg-black transition-colors">
                  <Plus size={15} className="text-[#ffa71c]" />
                  {t("home.addRecipe")}
                </button>
              </Link>
            </div>
            <div className="sm:block absolute right-0 top-0 bottom-0 w-[55%]">
              <Image
                src={"/photo-1467003909585-2f8a72700288[1]jpg.jpg"}
                alt="Seared tuna salad"
                className="w-full h-full object-cover"
                width={480}
                height={0}
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 15%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 15%)",
                }}
              />
            </div>
          </section>

          {/* Section heading */}
          <div className="text-center mt-14 mb-7">
            <h2
              className="text-[24px] sm:text-[28px] text-stone-900"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              {t("home.whatToCook")}
            </h2>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12 px-1">
            {CATEGORIES.map((c, index) => {
              const Icon = c.icon;
              return (
                <button
                  key={index}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                    active === c.value
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
                  }`}
                >
                  <Icon
                    size={14}
                    className={
                      active === c.value ? "text-[#ffa71c]" : "text-stone-400"
                    }
                  />
                  {t(c.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Recipe grid */}
          {showRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {showRecipes}
            </div>
          ) : load === true ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 min-h-[200px]">
              <span className="inline-flex w-16 h-16 rounded-full bg-[#ffa71c]/12 items-center justify-center mb-5">
                <ChefHat size={26} className="text-[#a95f00]" />
              </span>
              <h3
                className="text-[17px] text-stone-900 mb-1.5"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {t("home.noRecipes")}
              </h3>
              <p className="text-stone-500 text-[13.5px] max-w-xs">
                {t("home.noRecipesDescription")}
              </p>
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Link href={"/recipes"}>
              <button className="inline-flex items-center gap-2 border border-stone-300 text-stone-700 text-[13.5px] font-semibold px-6 py-3 rounded-full hover:border-[#ffa71c] hover:text-stone-900 transition-colors">
                {t("home.viewAllRecipes")}
                <ArrowUpRight size={15} />
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
