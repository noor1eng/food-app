"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  Clock,
  Gauge,
  Pencil,
  PlusCircle,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/token";
import { toast } from "@/components/ui/toast";
import { t } from "@/app/il8n";

/* ---------------------------------------------------------
   FLAVORIZ — My Recipes
   Same system as Add/Edit Recipe: charcoal sidebar, cream
   canvas, marmalade-orange accent, Fraunces + Jakarta Sans.
--------------------------------------------------------- */

const CATEGORIES = [
  "All Categories",
  "Pasta",
  "Main Course",
  "Salad",
  "Soup",
  "Breakfast",
  "Seafood",
];

// const RECIPES = [
//   {
//     title: "Creamy Chicken Pasta",
//     category: "Pasta",
//     time: "20 min",
//     difficulty: "Easy",
//     rating: 4.8,
//     views: 245,
//     img: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     title: "Beef Burger",
//     category: "Main Course",
//     time: "30 min",
//     difficulty: "Medium",
//     rating: 4.6,
//     views: 189,
//     img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     title: "Avocado Salad",
//     category: "Salad",
//     time: "15 min",
//     difficulty: "Easy",
//     rating: 4.9,
//     views: 320,
//     img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     title: "Tomato Soup",
//     category: "Soup",
//     time: "25 min",
//     difficulty: "Easy",
//     rating: 4.7,
//     views: 156,
//     img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     title: "Fluffy Pancakes",
//     category: "Breakfast",
//     time: "20 min",
//     difficulty: "Easy",
//     rating: 4.8,
//     views: 278,
//     img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     title: "Grilled Salmon",
//     category: "Seafood",
//     time: "25 min",
//     difficulty: "Medium",
//     rating: 4.9,
//     views: 312,
//     img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop",
//   },
// ];

// function Pagination({ page, setPage, totalPages }) {
//   return (
//     <div className="flex items-center justify-center gap-1.5 mt-10">
//       <button
//         onClick={() => setPage((p) => Math.max(1, p - 1))}
//         disabled={page === 1}
//         className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:bg-white hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
//       >
//         {/* <ChevronLeft size={16} /> */}
//       </button>
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//         <button
//           key={n}
//           onClick={() => setPage(n)}
//           className={`w-9 h-9 rounded-full text-[13px] font-semibold transition-colors ${
//             n === page
//               ? "bg-[#ffa71c] text-stone-900"
//               : "text-stone-500 hover:bg-white hover:text-stone-800"
//           }`}
//         >
//           {n}
//         </button>
//       ))}
//       <button
//         onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//         disabled={page === totalPages}
//         className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:bg-white hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
//       >
//         {/* <ChevronRight size={16} /> */}
//       </button>
//     </div>
//   );
// }

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [render, setRender] = useState(false);
  const [category, setCategory] = useState([]);
  const router = useRouter();
  const { token } = useAuth();
  console.log(token);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/category");
        setCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/recipe");
        console.log(res.data);
        setRecipes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
    fetchRecipes();
  }, [render]);

  async function deleterecipe(id) {
    try {
      await axios.delete(`http://localhost:5000/api/v1/recipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.add({
        title: "Recipe deleted",
        description: "The recipe has been removed from your collection.",
        type: "success",
        timeout: 2000,
      });
      setRender((prev) => !prev);
    } catch (err) {
      console.error(err);
      toast.add({
        title: "Delete failed",
        description:
          err?.response?.data?.message || "Could not remove the recipe.",
        type: "error",
        timeout: 2000,
      });
    }
  }

  const showRecipes = recipes?.map((recipe, index) => {
    return (
      <div
        key={index}
        className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fff4e3]">
          {recipe.coverImage ? (
            <Image
              src={`http://localhost:5000/images/${encodeURIComponent(recipe.coverImage)}`}
              alt={recipe.title}
              fill
              unoptimized
              loading="eager"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border-b border-dashed border-stone-300 bg-stone-50 text-[13px] text-stone-400">
              No image available
            </div>
          )}

          {recipe.category && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold text-stone-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">
              {recipe.title}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="text-[16px] text-stone-900 mb-2 truncate"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {recipe.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-stone-500 mb-4">
            {recipe.time && (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {recipe.time}
              </span>
            )}
            {recipe.difficulty && (
              <span className="inline-flex items-center gap-1">
                <Gauge size={12} /> {recipe.difficulty}
              </span>
            )}
            {recipe.rating != null && (
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="text-[#ffa71c] fill-[#ffa71c]" />
                {recipe.rating}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/editrecipe/${recipe._id}`)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 text-stone-700 text-[13px] font-semibold py-2 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => deleterecipe(recipe._id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-500 text-[13px] font-semibold py-2 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
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
            {/* Heading */}
            <div className="mb-6">
              <h1
                className="text-[28px] text-stone-900"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {t("myRecipes.title")}
              </h1>
              <p className="text-stone-500 text-[14px] mt-1">
                {t("myRecipes.description")}
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  placeholder={t("recipes.searchPlaceholder")}
                  className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-[13.5px] outline-none focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10 transition-all"
                />
              </div>

              <div className="relative">
                <select className="appearance-none rounded-xl border border-stone-200 bg-white pl-4 pr-9 py-2.5 text-[13.5px] outline-none focus:border-[#ffa71c] w-full md:w-48 transition-colors">
                  {category.map((c, index) => (
                    <option key={index}>{c.name}</option>
                  ))}
                </select>
                {/* <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                /> */}
              </div>
              <Link href="/dashboard/addrecipe">
                <button className="inline-flex items-center justify-center gap-1.5 bg-[#ffa71c] text-stone-900 text-[13.5px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#ff9c00] shadow-[0_8px_20px_-8px_rgba(255,167,28,0.6)] transition-colors shrink-0">
                  <PlusCircle size={16} /> {t("myRecipes.addRecipe")}
                </button>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {showRecipes.length > 0 ? (
                showRecipes
              ) : (
                <div className="col-span-full rounded-[24px] border border-dashed border-stone-300 bg-white/70 p-10 text-center text-stone-500">
                  {t("myRecipes.empty")}
                </div>
              )}
            </div>

            {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} /> */}
          </main>
        </div>
      </div>
    </div>
  );
}
