"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Star,
  Heart,
  ChefHat,
  MessageCircle,
  Send,
  ThumbsUp,
  Images,
  ListChecks,
  Check,
} from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { t, useI18n } from "@/app/il8n";
import { toast } from "@/components/ui/toast";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";
import { SkeletonRecipeDetials } from "@/app/skeleton/SkeletonRecipeDetials";

/* ───────── helpers (مبنية على الـ schema) ───────── */
const LEVELS = { easy: 1, سهل: 1, medium: 2, متوسط: 2, hard: 3, صعب: 3 };
const LEVEL_COLOR = ["", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
const IMG = (name) =>
  `http://localhost:5000/images/${encodeURIComponent(name)}`;

const formatTime = (m) => {
  const n = Number(m) || 0;
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const r = n % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

// نص -> مصفوفة (سطر جديد أو فاصلة عادية أو عربية)
const toIngredients = (s) =>
  String(s || "")
    .split(/[\n,،]+/)
    .map((x) => x.trim())
    .filter(Boolean);

// يحذف الترقيم القديم ("1." أو "-") ويقسم على الأسطر، وإذا فقرة وحدة يقسمها على الجمل
const toSteps = (s) => {
  const lines = String(s || "")
    .split(/\n+/)
    .map((x) => x.replace(/^\s*(\d+[.)\-]|[-•*])\s*/, "").trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  return (lines[0] || "").split(/(?<=[.!?؟])\s+/).filter(Boolean);
};

const INITIAL_COMMENTS = [
  {
    id: 1,
    name: "Sarah Ibrahim",
    avatar: "https://i.pravatar.cc/64?img=32",
    rating: 5,
    date: "2 days ago",
    text: "Made this last night and it was gone in minutes! The sauce is incredibly rich without being heavy.",
    likes: 12,
  },
  {
    id: 2,
    name: "Omar Khaled",
    avatar: "https://i.pravatar.cc/64?img=47",
    rating: 4,
    date: "5 days ago",
    text: "Great recipe overall. I added a bit of chili flakes for some heat and it worked really well.",
    likes: 6,
  },
];

function StarRating({ value, onChange, size = 18, interactive = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = interactive
          ? n <= (hover || value)
          : n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(n)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange && onChange(n)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={size}
              className={
                filled ? "fill-[#ffa71c] text-[#ffa71c]" : "text-stone-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

export default function RecipeDetailsPage() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState({});
  const { language } = useI18n();
  const id = useParams().id;

  useEffect(() => {
    let alive = true;
    axios
      .get(`http://localhost:5000/api/v1/recipe/${id}`)
      .then((res) => {
        if (!alive) return;
        setRecipe(res.data);
        setSaved(!!res.data.favorate);
      })
      .catch((err) => {
        console.error("Error fetching recipe details:", err);
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const ingredients = useMemo(
    () => toIngredients(recipe?.ingrediaint),
    [recipe],
  );
  const steps = useMemo(() => toSteps(recipe?.instructions), [recipe]);
  const doneCount = ingredients.filter((_, i) => checked[i]).length;

  // تقييم الوصفة نفسها من الـ schema، وإذا ما في تقييم نعرض متوسط التعليقات
  const avgRating = useMemo(() => {
    if (recipe?.rating) return Number(recipe.rating);
    if (!comments.length) return 0;
    return comments.reduce((a, c) => a + c.rating, 0) / comments.length;
  }, [recipe, comments]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || userRating === 0) return;
    setComments([
      {
        id: Date.now(),
        name: "You",
        avatar: "https://i.pravatar.cc/64?img=68",
        rating: userRating,
        date: "Just now",
        text: commentText.trim(),
        likes: 0,
      },
      ...comments,
    ]);
    setCommentText("");
    setUserRating(0);
  };

  async function handleEditFavorate(recipeId) {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/recipe/${recipeId}/favorate`,
      );
      const next = !saved;
      setSaved(next);
      toast.add({
        title: next ? "added to favorate" : "removed from favorate",
        description: next
          ? "Your recipe has been added to favorite"
          : "Your recipe has been removed from favorite",
        type: "success",
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (error)
    return (
      <div className="py-32 text-center text-stone-500">Recipe not found.</div>
    );
  if (!recipe) return <SkeletonRecipeDetials />;

  const level = LEVELS[String(recipe.difficulty).trim().toLowerCase()] ?? 2;
  const gallery = recipe.images || [];

  return (
    <div
      className="w-full bg-[#F6F2EA] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}.fu{animation:fadeUp .6s cubic-bezier(.2,.7,.2,1) both}`}</style>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* ───── Hero ───── */}
        <section className="fu relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[32px] sm:aspect-[21/9]">
            <Image
              src={IMG(recipe.coverImage)}
              alt={recipe.title || ""}
              fill
              unoptimized
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-stone-950/20" />

            <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-8 sm:top-7">
              {recipe.category?.name ? (
                <span className="rounded-full bg-[#FCFAF6]/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-800 backdrop-blur">
                  {recipe.category.name}
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                aria-pressed={saved}
                aria-label="favorite"
                onClick={() => handleEditFavorate(recipe._id)}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition-colors ${
                  saved
                    ? "bg-red-500 text-white"
                    : "bg-white/70 text-stone-700 hover:bg-red-500 hover:text-white"
                }`}
              >
                <Heart size={17} className={saved ? "fill-white" : ""} />
              </button>
            </div>

            <div className="absolute inset-x-5 bottom-14 sm:inset-x-10 sm:bottom-16">
              <h1
                className="max-w-3xl text-[30px] leading-[1.05] text-white sm:text-[52px]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* stat strip */}
          <div
            className="fu relative z-10 mx-3 -mt-8 grid grid-cols-2 divide-stone-200 rounded-3xl border border-stone-200 bg-white py-4 shadow-[0_20px_40px_-24px_rgba(60,40,10,0.35)] sm:mx-10 sm:grid-cols-4 sm:divide-x rtl:sm:divide-x-reverse"
            style={{ animationDelay: ".12s" }}
          >
            <Stat
              label="Time"
              icon={<Clock size={16} className="text-[#ffa71c]" />}
            >
              {formatTime(recipe.time)}
            </Stat>
            <Stat
              label="Difficulty"
              icon={
                <div className="flex h-4 items-end gap-[3px]">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{ height: 6 + i * 3 }}
                      className={`w-[4px] rounded-sm ${i <= level ? LEVEL_COLOR[level] : "bg-stone-200"}`}
                    />
                  ))}
                </div>
              }
            >
              <span className="capitalize">{recipe.difficulty}</span>
            </Stat>
            <Stat
              label="Ingredients"
              icon={<ListChecks size={16} className="text-[#ffa71c]" />}
            >
              {ingredients.length} items
            </Stat>
            <Stat
              label="Rating"
              icon={
                <Star size={16} className="fill-[#ffa71c] text-[#ffa71c]" />
              }
            >
              {avgRating ? avgRating.toFixed(1) : "—"}
              <span className="ms-1 text-[12px] font-medium text-stone-400">
                ({comments.length})
              </span>
            </Stat>
          </div>
        </section>

        {/* ───── Content ───── */}
        <div className="mb-16 mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <section className="fu" style={{ animationDelay: ".2s" }}>
              <p className="text-[15.5px] leading-[1.8] text-stone-600 first-letter:float-start first-letter:me-2 first-letter:text-[52px] first-letter:leading-[0.9] first-letter:text-stone-900">
                {recipe.description}
              </p>
            </section>

            {gallery.length > 0 && (
              <section className="fu" style={{ animationDelay: ".26s" }}>
                <div
                  className={`grid gap-3 ${gallery.length === 1 ? "grid-cols-1" : gallery.length % 3 === 0 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
                >
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200"
                    >
                      <Image
                        src={IMG(img)}
                        alt={`${recipe.title} ${i + 1}`}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="fu" style={{ animationDelay: ".32s" }}>
              <ol className="relative space-y-7">
                <span className="absolute bottom-3 start-[19px] top-3 w-px bg-stone-300/70" />
                {steps.map((step, i) => (
                  <li key={i} className="relative flex gap-5">
                    <span
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[17px] text-white ring-4 ring-[#F6F2EA]"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1.5 text-[15px] leading-[1.75] text-stone-700">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ───── Ingredients ───── */}
          <aside className="fu" style={{ animationDelay: ".24s" }}>
            <div className="rounded-3xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
              <div className="mb-1 flex items-baseline justify-between">
                <h3
                  className="text-[22px] text-stone-900"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                >
                  {t("recipeDetails.ingredients")}
                </h3>
                <span className="text-[12px] font-semibold text-stone-400">
                  {doneCount}/{ingredients.length}
                </span>
              </div>
              <div className="mb-5 h-1 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-[#ffa71c] transition-all duration-300"
                  style={{
                    width: `${ingredients.length ? (doneCount / ingredients.length) * 100 : 0}%`,
                  }}
                />
              </div>

              <ul className="space-y-1">
                {ingredients.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                      className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-start transition-colors hover:bg-stone-50"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${checked[i] ? "border-[#ffa71c] bg-[#ffa71c]" : "border-stone-300 bg-white"}`}
                      >
                        {checked[i] && (
                          <Check
                            size={13}
                            className="text-stone-900"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                      <span
                        className={`text-[14px] leading-snug transition-colors ${checked[i] ? "text-stone-400 line-through" : "text-stone-700"}`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                <div>
                  <p className="mb-1 text-[11px] text-stone-400">
                    {t("recipeDetails.rateRecipe")}
                  </p>
                  <StarRating
                    value={userRating}
                    onChange={setUserRating}
                    interactive
                    size={18}
                  />
                </div>
                <ChefHat size={22} className="text-[#ffa71c]" />
              </div>
            </div>
          </aside>
        </div>

        {/* ───── Reviews ───── */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <MessageCircle size={18} className="text-stone-700" />
            <h2
              className="text-[26px] text-stone-900"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {t("recipeDetails.reviews")}
            </h2>
            <span className="text-[13px] text-stone-400">
              ({comments.length})
            </span>
          </div>

          <form
            onSubmit={handleSubmitComment}
            className="mb-8 rounded-3xl border border-stone-200 bg-white p-5 sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <label className="text-[13px] font-semibold text-stone-700">
                {t("recipeDetails.yourRating")}
              </label>
              <StarRating
                value={userRating}
                onChange={setUserRating}
                interactive
                size={18}
              />
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("recipeDetails.shareThoughts")}
              rows={3}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-[13.5px] text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#ffa71c] focus:bg-white focus:ring-4 focus:ring-[#ffa71c]/10"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || userRating === 0}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("recipeDetails.postComment")} <Send size={13} />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.avatar}
                    className="h-10 w-10 rounded-full object-cover"
                    alt={c.name}
                  />
                  <div>
                    <p className="text-[13.5px] font-semibold text-stone-800">
                      {c.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <StarRating value={c.rating} size={12} />
                      <span className="text-[11px] text-stone-400">
                        {c.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3.5 text-[13.5px] leading-relaxed text-stone-600">
                  {c.text}
                </p>
                <button className="mt-3.5 inline-flex items-center gap-1.5 text-[12px] text-stone-400 transition-colors hover:text-[#a95f00]">
                  <ThumbsUp size={13} /> {t("recipeDetails.helpful")} ({c.likes}
                  )
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, icon, children }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-stone-400">
        {label}
      </span>
      <div className="flex items-center gap-2 text-[16px] font-semibold text-stone-900">
        {icon}
        <span>{children}</span>
      </div>
    </div>
  );
}
