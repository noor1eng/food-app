"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  ArrowUpRight,
  Search,
  ChevronDown,
  ChefHat,
  Soup,
  Sandwich,
  Salad,
  Leaf,
  Globe2,
  IceCreamCone,
  HeartPulse,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";

const LINKS = [
  { label: "Home", active: false },
  { label: "Recipes", active: true },
  { label: "Blog", active: false },
  { label: "Contact", active: false },
];

const CATEGORIES = [
  { label: "All Types", icon: ChefHat },
  { label: "Appetizers", icon: Sandwich },
  { label: "Main Courses", icon: Soup },
  { label: "Salads & Sides", icon: Salad },
  { label: "Vegetarian", icon: Leaf },
  { label: "International", icon: Globe2 },
  { label: "Desserts", icon: IceCreamCone },
  { label: "Healthy Eats", icon: HeartPulse },
  { label: "Quick & Easy", icon: Zap },
];

const RECIPES = [
  {
    title: "Fresh Salad with Tahini Sauce",
    views: "250+",
    category: "Salads & Sides",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Chili con Carne with Nachos Chips",
    views: "150+",
    category: "Main Courses",
    img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Sour & Spicy Korean Kimchi",
    views: "200+",
    category: "International",
    img: "https://images.unsplash.com/photo-1583224964978-2257b960c3d6?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Classic Italian Beef Maltagliati",
    views: "180+",
    category: "Main Courses",
    highlight: true,
    description:
      "Layers of spicy goodness, hearty meat, and savory sauce. A timeless favorite with Maltagliati pasta.",
  },
  {
    title: "Flat Noodles with Shrimp Veggie",
    views: "200+",
    category: "Main Courses",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Cauliflower Steak Chimichurri",
    views: "150+",
    category: "Vegetarian",
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Whip up something sweet",
    views: "320+",
    category: "Desserts",
    highlight: true,
    description:
      "A rotating collection of no-fuss desserts, from citrus tarts to spiced cookies — ready in under 30 minutes.",
  },
  {
    title: "Grilled Salmon & Greens",
    views: "312+",
    category: "Healthy Eats",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Creamy Chicken Pasta",
    views: "245+",
    category: "Main Courses",
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=600&auto=format&fit=crop",
  },
];

export default function RecipesPage() {
  const [active, setActive] = useState("All Types");
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    try {
      async function fetchRecipes() {
        const response = await axios.get("http://localhost:5000/api/v1/recipe");
        console.log(response.data);
        setRecipes(response.data);
      }
      fetchRecipes();
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [active, query]);

  const showRecipes = recipes.map((recipe) => {
    const imageSrc = recipe.coverImage?.startsWith("http")
      ? recipe.coverImage
      : `http://localhost:5000/images/${encodeURIComponent(recipe.coverImage || "default.jpg")}`;

    const categoryLabel = recipe.category || "Uncategorized";
    const shortDescription =
      recipe.description?.length > 95
        ? `${recipe.description.slice(0, 95)}...`
        : recipe.description ||
          "A flavorful recipe with simple ingredients and a comforting finish.";

    return (
      <div
        key={recipe._id}
        className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-22px_rgba(15,23,42,0.55)]"
      >
        <div className="relative overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={imageSrc}
              alt={recipe.title}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur">
              <ChefHat size={11} className="text-[#ffa71c]" />
              {/* {categoryLabel} */}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500">
              <Eye size={13} className="text-[#ffa71c]" />
              {recipe.rating ? `${recipe.rating}` : "Fresh recipe"}
            </div>
            <span className="rounded-full bg-[#fff3df] px-2.5 py-1 text-[10px] font-semibold text-[#a95f00]">
              {recipe.time || "Quick"}
            </span>
          </div>

          <h3
            className="text-[20px] leading-snug text-stone-900 mb-2"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
          >
            {recipe.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-stone-600">
            {shortDescription}
          </p>

          <div className="mt-auto pt-4">
            <Link
              href={`/recipedetails/${recipe._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-black"
            >
              See Complete Recipe
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className="w-full bg-[#f7f7f7] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#a95f00] bg-[#ffa71c]/15 px-3 py-1 rounded-full mb-3">
              <ChefHat size={13} /> {recipes.length} recipes found
            </div>
            <h1
              className="text-[28px] sm:text-[34px] leading-tight text-stone-900"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              All <span className="text-[#ffa71c]">Recipes</span>
            </h1>
          </div>

          <div className="relative sm:w-72">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full rounded-full bg-white border border-stone-200 focus:border-[#ffa71c]/50 pl-10 pr-4 py-2.5 text-[13px] outline-none transition-colors placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
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
                {label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {showRecipes}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="inline-flex w-14 h-14 rounded-full bg-[#ffa71c]/12 items-center justify-center mb-4">
              <ChefHat size={22} className="text-[#a95f00]" />
            </span>
            <p className="text-stone-500 text-[14px]">
              No recipes match your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
