"use client";
import React, { useState, useEffect, useRef } from "react";
import {
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
  Star,
  Images,
  Heart,
  BookOpenCheck,
  Share2,
  Search,
} from "lucide-react";
import Navbar from "../../Navbar";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/context/token";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { t, useI18n } from "@/app/il8n";

/* ───────── helpers ───────── */
// يستعمل الترجمة إذا المفتاح موجود، وإلا النص الافتراضي (ضيف المفاتيح landing.* لملف الترجمة بوقتها)
const tx = (key, fallback) => {
  const v = t(key);
  return !v || v === key ? fallback : v;
};

const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
const U = (id) =>
  `https://images.unsplash.com/${id}?q=80&w=900&auto=format&fit=crop`;

const formatTime = (m) => {
  const n = Number(m) || 0;
  if (n < 60) return `${n} ${t("common.minuteShort")}`;
  const h = Math.floor(n / 60);
  const r = n % 60;
  return r
    ? `${h}${t("common.hourShort")} ${r} ${t("common.minuteShort")}`
    : `${h}${t("common.hourShort")}`;
};
const countIngredients = (s) =>
  String(s || "")
    .split(/[\n,،]+/)
    .filter((x) => x.trim()).length;

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

/* صور الـ Mosaic (من نفس صور Unsplash اللي كنت مستخدمها) */
const LESSONS = [
  {
    id: "photo-1621996346565-e3dbc353d2e5",
    titleKey: "landing.lessonSauces",
    cls: "col-span-2 row-span-2",
  },
  {
    id: "photo-1540420773420-3366772f4999",
    titleKey: "landing.lessonFresh",
    cls: "",
  },
  {
    id: "photo-1467003909585-2f8a72700288",
    titleKey: "landing.lessonSear",
    cls: "row-span-2",
  },
  {
    id: "photo-1583224964978-2257b960c3d6",
    titleKey: "landing.lessonFerment",
    cls: "",
  },
  {
    id: "photo-1567620905732-2d1ec7ab7445",
    titleKey: "landing.lessonBreakfast",
    cls: "col-span-2",
  },
  {
    id: "photo-1585032226651-759b368d7246",
    titleKey: "landing.lessonWok",
    cls: "col-span-2",
  },
];

/* ───────── Scroll reveal ───────── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined")
      return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ───────── Landing sections ───────── */
function Intro() {
  const features = [
    {
      icon: BookOpenCheck,
      title: tx("landing.f1Title", "Step-by-step recipes"),
      text: tx(
        "landing.f1Text",
        "Ingredients you can tick off and numbered steps you can follow without guessing.",
      ),
    },
    {
      icon: Heart,
      title: tx("landing.f2Title", "Your own cookbook"),
      text: tx(
        "landing.f2Text",
        "Save what you love in one tap and come back to it any time.",
      ),
    },
    {
      icon: Share2,
      title: tx("landing.f3Title", "Cook, then share"),
      text: tx(
        "landing.f3Text",
        "Add your own recipes with photos and let others rate them.",
      ),
    },
  ];
  return (
    <section className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-7">
        <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a95f00]">
          <span className="h-px w-8 bg-[#a95f00]" />{" "}
          {tx("landing.eyebrow", "About Flavoriz")}
        </p>
        <h2
          className="text-[40px] leading-[1.02] text-stone-900 sm:text-[62px]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          {tx("landing.headline1", "A kitchen school,")}{" "}
          <em className="text-[#c77800]">
            {tx("landing.headline2", "disguised as a recipe book.")}
          </em>
        </h2>
        <p className="mt-6 max-w-xl text-[16px] leading-[1.8] text-stone-600">
          {tx(
            "landing.intro",
            "Flavoriz is where home cooks learn by doing. Every recipe is broken into clear steps, with the time, the difficulty and the exact ingredients up front, so you always know what you're getting into before you turn on the stove.",
          )}
        </p>
      </Reveal>

      <Reveal delay={120} className="lg:col-span-5">
        <ul className="divide-y divide-stone-200 rounded-3xl border border-stone-200 bg-[#FCFAF6]">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-900">
                <Icon size={18} className="text-[#ffa71c]" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-stone-900">
                  {title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-stone-500">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function LearnMosaic() {
  return (
    <section className="mt-24">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a95f00]">
            {tx("landing.learnEyebrow", "Learn by cooking")}
          </p>
          <h2
            className="text-[32px] leading-tight text-stone-900 sm:text-[44px]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            {tx("landing.learnTitle", "Six skills worth mastering")}
          </h2>
        </div>
        <p className="max-w-xs text-[14px] leading-relaxed text-stone-500">
          {tx(
            "landing.learnText",
            "From a first sauce to a weeknight stir-fry, each dish teaches one technique you'll use forever.",
          )}
        </p>
      </Reveal>

      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4 md:gap-4">
        {LESSONS.map((l, i) => {
          const title = t(l.titleKey);
          return (
            <Reveal key={l.id} delay={i * 70} className={`${l.cls} min-h-0`}>
            <figure className="group relative h-full w-full overflow-hidden rounded-[24px] bg-stone-200">
              <Image
                src={U(l.id)}
                alt={title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-4 bottom-4">
                <span className="mb-1.5 inline-block rounded-full bg-[#ffa71c] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-900">
                  {tx("landing.lesson", "Lesson")}{" "}
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[15px] leading-tight text-white sm:text-[17px]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {title}
                </p>
              </figcaption>
            </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: tx("landing.s1Title", "Pick a recipe"),
      text: tx(
        "landing.s1Text",
        "Browse by category and check the time and difficulty at a glance.",
      ),
    },
    {
      icon: ListChecks,
      title: tx("landing.s2Title", "Cook along"),
      text: tx(
        "landing.s2Text",
        "Tick off ingredients as you go and follow every step in order.",
      ),
    },
    {
      icon: Heart,
      title: tx("landing.s3Title", "Save & share"),
      text: tx(
        "landing.s3Text",
        "Keep your favorites close and publish your own creations.",
      ),
    },
  ];
  return (
    <section className="mt-24">
      <Reveal className="mb-10 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a95f00]">
          {tx("landing.howEyebrow", "How it works")}
        </p>
        <h2
          className="text-[32px] text-stone-900 sm:text-[44px]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          {tx("landing.howTitle", "From craving to plate in three steps")}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 110}>
            <div className="relative h-full overflow-hidden rounded-[28px] border border-stone-200 bg-[#FCFAF6] p-7">
              <span
                className="pointer-events-none absolute -end-2 -top-6 text-[120px] leading-none text-[#ffa71c]/20"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {i + 1}
              </span>
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900">
                <Icon size={20} className="text-[#ffa71c]" />
              </span>
              <h3
                className="text-[22px] text-stone-900"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                {title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-stone-500">
                {text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── Recipe card ───────── */
function RecipeCard({ recipe }) {
  const level = LEVELS[String(recipe.difficulty).trim().toLowerCase()] ?? 2;
  const difficultyKey = [
    "",
    "recipeForm.essentials.easy",
    "recipeForm.essentials.medium",
    "recipeForm.essentials.hard",
  ][level];
  const categoryName = recipe.category?.name;
  const photos = recipe.images?.length || 0;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#FCFAF6] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(60,40,10,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`http://localhost:5000/images/${encodeURIComponent(recipe.coverImage)}`}
          alt={recipe.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/10" />
        {categoryName && (
          <span className="absolute start-4 top-4 rounded-full bg-[#FCFAF6]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
            {categoryName}
          </span>
        )}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
          {recipe.rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/55 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
              <Star size={12} className="fill-[#ffa71c] text-[#ffa71c]" />
              {Number(recipe.rating).toFixed(1)}
            </span>
          ) : (
            <span />
          )}
          {photos > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-950/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              <Images size={12} />+{photos}
            </span>
          )}
        </div>
      </div>

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
        <div className="mt-4 grid grid-cols-3 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white py-2.5 rtl:divide-x-reverse">
          <div className="flex flex-col items-center gap-0.5">
            <Clock size={14} className="text-stone-400" />
            <span className="text-[12px] font-semibold text-stone-800">
              {formatTime(recipe.time)}
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
              {t(difficultyKey)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <ListChecks size={14} className="text-stone-400" />
            <span className="text-[12px] font-semibold text-stone-800">
              {t("home.ingredientsCount", {
                count: countIngredients(recipe.ingrediaint),
              })}
            </span>
          </div>
        </div>
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
}

/* ───────── Page ───────── */
export default function Hero() {
  const { language } = useI18n();
  const [active, setActive] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [load, setLoad] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    let alive = true;
    axios
      .get("http://localhost:5000/api/v1/recipe")
      .then((res) => alive && setRecipes(res.data))
      .catch((err) => console.log(err))
      .finally(() => alive && setLoad(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="w-full bg-[#F6F2EA]"
        dir={language === "ar" ? "rtl" : "ltr"}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          {/* Hero banner */}
          <section className="relative flex min-h-[220px] items-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#eef1ea] to-[#e4e8de] sm:min-h-[300px]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 max-w-[55%] px-7 py-10 sm:max-w-[45%] sm:px-12">
              <h1
                className="text-[26px] leading-[1.1] text-stone-900 sm:text-[42px]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                {t("home.title")}
              </h1>
              <Link href={token ? "/dashboard/addrecipe" : "/register"}>
                <button className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-stone-800 py-2.5 ps-3.5 pe-4 text-[10.5px] font-semibold text-white transition-colors hover:bg-black lg:text-[12.5px]">
                  <Plus size={15} className="text-[#ffa71c]" />
                  {t("home.addRecipe")}
                </button>
              </Link>
            </div>
            <div className="absolute bottom-0 end-0 top-0 w-[55%] sm:block">
              <Image
                src={"/photo-1467003909585-2f8a72700288[1]jpg.jpg"}
                alt={t("landing.heroImageAlt")}
                className="h-full w-full object-cover"
                width={480}
                height={0}
                style={{
                  maskImage:
                    `linear-gradient(to ${language === "ar" ? "left" : "right"}, transparent, black 15%)`,
                  WebkitMaskImage:
                    `linear-gradient(to ${language === "ar" ? "left" : "right"}, transparent, black 15%)`,
                }}
              />
            </div>
          </section>

          {/* ───── Landing sections ───── */}
          <Intro />
          <LearnMosaic />
          <HowItWorks />

          {/* Section heading */}
          <Reveal className="mb-8 mt-28 text-center">
            <h2
              className="text-[32px] text-stone-900 sm:text-[44px]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {t("home.whatToCook")}
            </h2>
          </Reveal>

          {/* Category pills */}
          <div className="mb-12 flex flex-wrap justify-center gap-2.5 px-1">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.value}
                  onClick={() => setActive(c.value)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    active === c.value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-500 hover:border-[#ffa71c]/50 hover:text-stone-800"
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

          {/* Recipe grid (أول 6 وصفات فقط بالصفحة الرئيسية) */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.slice(0, 6).map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : load ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center py-8 text-center">
              <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ffa71c]/15">
                <ChefHat size={26} className="text-[#a95f00]" />
              </span>
              <h3
                className="mb-1.5 text-[19px] text-stone-900"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {t("home.noRecipes")}
              </h3>
              <p className="max-w-xs text-[13.5px] text-stone-500">
                {t("home.noRecipesDescription")}
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/recipes">
              <button className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-[13.5px] font-semibold text-stone-700 transition-colors hover:border-[#ffa71c] hover:text-stone-900">
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
