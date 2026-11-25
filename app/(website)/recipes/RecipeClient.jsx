"use client";
import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { t, useI18n } from "@/app/il8n";
import { toast } from "@/components/ui/toast";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChefHat,
  Clock,
  Heart,
  Images,
  ListChecks,
  Star,
} from "lucide-react";

export default function RecipesClient({
  recipes,
  categories,
  search,
  activeCategory,
}) {
  const { language } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState(activeCategory || "");
  const [saved, setSaved] = useState("unsaved");

  const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
  const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  // البحث: نص محلي + debounce قبل ما نحدّث الرابط
  const [text, setText] = useState(search);
  useEffect(() => {
    if (text === search) return;
    const id = setTimeout(() => setParam("search", text), 400);
    return () => clearTimeout(id);
  }, [text]);

  function setParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    // تغيير الرابط بيعيد تشغيل الـ Server Component وبيجيب بيانات جديدة
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  async function handleEditFavorate(id) {
    try {
      await axios
        .put(`http://localhost:5000/api/v1/recipe/${id}/favorate`)
        .then((res) => {
          setSaved(res.data.favorate ? "saved" : "unsaved");
        });
      toast.add({
        title: saved == "saved" ? "added to favorate" : "removed from favorate",
        description:
          saved == "saved"
            ? "Your recipe has been added to favorate"
            : "Your recipe has been removed from favorate",
        type: "success",
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const showCategories = categories.map((cat) => {
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
              recipe.favorate == true && saved == "saved"
                ? "bg-red-500 text-white "
                : "bg-white text-stone-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              size={16}
              className={recipe.favorate ? "fill-white" : "fill-white"}
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
    <div className="w-full bg-[#f7f7f7] text-stone-900">
      <main
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8"
        style={{ direction: language == "ar" ? "rtl" : "ltr" }}
      >
        {categories.length > 0 ? (
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
            {showCategories}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-stone-500">
            <p className="text-center text-[15px] font-medium">
              {t("recipes.noCategories")}
            </p>
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {showRecipes}
          </div>
        ) : (
          /* حالة "ما في وصفات" نفسها */
          <div className="flex flex-col items-center justify-center text-center py-8 min-h-[400px]  ">
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
      </main>
    </div>
  );
}
