"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  ChefHat,
  Soup,
  Sandwich,
  Salad,
  Leaf,
  Globe2,
  IceCreamCone,
  HeartPulse,
  Zap,
  Clock,
  Gauge,
  Star,
  Heart,
  Images,
  ListChecks,
} from "lucide-react";
import { t, useI18n } from "@/app/il8n";
import axios from "axios";
import Image from "next/image";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { toast } from "@/components/ui/toast";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "all", labelKey: "recipes.filters.allTypes", icon: ChefHat },
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

export default function RecipesPage() {
  const [active, setActive] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [load, setLoad] = useState(false);
  const [saved, setSaved] = useState(false);
  const [category, setCategory] = useState([]);
  const { language } = useI18n();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // بدل useState: القيم بتجي من الرابط
  const search = searchParams.get("search") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  // / easy / medium / hard  ->  1 / 2 / 3
  const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
  const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  // بدل useState: القيم بتجي من الرابط
  function setParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    setLoad(true);
    try {
      async function fetchRecipes() {
        const response = await axios.get(
          "http://localhost:5000/api/v1/recipe",
          {
            params: { category: activeCategory, search },
          },
        );
        setRecipes(response.data);
        setLoad(false);
      }
      fetchRecipes();
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    try {
      async function fetchCategory() {
        await axios.get("http://localhost:5000/api/v1/category").then((res) => {
          setCategory(res.data);
        });
      }
      fetchCategory();
    } catch (err) {
      console.log(err);
    }
  }, []);

  async function handleEditFavorate(id) {
    try {
      await axios
        .put(`http://localhost:5000/api/v1/recipe/${id}/favorate`)
        .then((res) => {
          console.log(res.data);
          setSaved((prev) => !prev);
        });
      toast.add({
        title: "added to favorate",
        description: "Your recipe has been added to favorte",
        type: "success",
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const showCategory = category.map((cat) => {
    const isActive = active === cat.name;
    return (
      <div key={cat._id} className="">
        <button
          onClick={() => {
            setActive(cat.name);
            setParam("category", cat.name);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
            isActive
              ? "bg-stone-900 text-white border-stone-900"
              : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
          }`}
        >
          {t(cat.name)}
        </button>
      </div>
    );
  });

  const showRecipes = recipes.map((recipe) => {
    console.log(recipe);

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

          {/* favorite */}
          <button
            onClick={() => handleEditFavorate(recipe._id)}
            type="button"
            aria-label="favorite"
            aria-pressed={recipe.favorate}
            className={`absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
              recipe.favorate
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "bg-white/60 text-stone-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              size={16}
              className={recipe.favorate ? "fill-red-500" : "fill-white"}
            />
          </button>

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
                <Images size={12} />+{recipe.images.length}
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
    <div
      className="w-full bg-[#f7f7f7] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main
        className="max-w-7xl mx-auto px-5 sm:px-8 py-10"
        style={{ direction: language == "ar" ? "rtl" : "ltr" }}
      >
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#a95f00] bg-[#ffa71c]/15 px-3 py-1 rounded-full mb-3">
              <ChefHat size={13} /> {recipes.length}
            </div>
            <h1
              className="text-[28px] sm:text-[34px] leading-tight text-stone-900"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              {t("recipes.title")}
            </h1>
          </div>

          <div className="relative sm:w-72">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder={t("recipes.searchPlaceholder")}
              className="w-full rounded-full bg-white border border-stone-200 focus:border-[#ffa71c]/50 pl-10 pr-4 py-2.5 text-[13px] outline-none transition-colors placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Category pills */}
        {category.length > 0 ? (
          <div className=" flex flex-wrap gap-2.5 mb-10">
            <button
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                activeCategory == ""
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
              }`}
              onClick={() => {
                setActive("");
                setParam("category", "");
              }}
            >
              <ChefHat size={14} />
              All Type
            </button>
            {showCategory}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 mb-10">
            {CATEGORIES.map(({ value, labelKey, icon: Icon }) => {
              const isActive = active === value;
              return (
                <button
                  key={value}
                  onClick={() => {
                    setActive(value);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                    isActive
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-[#ffa71c]" : "text-stone-400"}
                  />
                  {t(labelKey)}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {showRecipes}
          </div>
        ) : load == true ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="inline-flex w-14 h-14 rounded-full bg-[#ffa71c]/12 items-center justify-center mb-4">
              <ChefHat size={22} className="text-[#a95f00]" />
            </span>
            <p className="text-stone-500 text-[14px]">
              {t("recipes.noResults")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
