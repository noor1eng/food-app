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
} from "lucide-react";
import Navbar from "../../Navbar";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/context/token";
import { SkeletonCard } from "@/app/skeleton/SkeletonCard";

const CATEGORIES = [
  { label: "All Types", icon: ChefHat, active: true },
  { label: "Appetizers", icon: Sandwich },
  { label: "Main Courses", icon: Soup },
  { label: "Salads & Sides", icon: Salad },
  { label: "Vegetarian Delights", icon: Leaf },
  { label: "International Flavors", icon: Globe2 },
  { label: "Desserts & Sweets", icon: IceCreamCone },
  { label: "Healthy Eats", icon: HeartPulse },
  { label: "Quick & Easy Supper", icon: Zap },
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
  const [active, setActive] = useState("All Types");
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [load, setLoad] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    setLoad(true);
    async function fetchRecipes() {
      await axios.get("http://localhost:5000/api/v1/recipe").then((res) => {
        setRecipes(res.data);
        setLoad(false);
      });
    }
    async function fetchCategories() {
      await axios.get("http://localhost:5000/api/v1/category").then((res) => {
        setCategories(res.data);
      });
    }
    fetchCategories();
    fetchRecipes();
  }, []);

  const showCategories = categories?.map((categroy) => {
    return (
      <button
        key={categroy._id}
        onClick={() => setActive(categroy.name)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
          active === categroy.name
            ? "bg-stone-900 text-white border-stone-900"
            : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
        }`}
      >
        {categroy.name}
      </button>
    );
  });

  const showRecipes = recipes?.map((recipe) => {
    return (
      <div
        key={recipe._id}
        className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-22px_rgba(15,23,42,0.55)]"
      >
        <div className="relative overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={`http://localhost:5000/images/${encodeURIComponent(recipe.coverImage)}`}
              alt={recipe.title}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur">
              <ChefHat size={11} className="text-[#ffa71c]" />
              {recipe.categroy}
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
            {recipe.descirption}
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
                Explore <span className="text-[#ffa71c]">Culinary</span>{" "}
                Insights
              </h1>
              <Link href={token ? "/dashboard/addrecipe" : "/register"}>
                <button className="flex justify-center items-center mt-5 gap-1.5 bg-stone-800 text-white text-[10.5px] lg:text-[12.5px] font-semibold pl-3.5 pr-4 py-2.5 rounded-full hover:bg-black transition-colors">
                  <Plus size={15} className="text-[#ffa71c]" />
                  Add Recipe
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
              What to <span className="text-[#ffa71c]">Cook</span>?
            </h2>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12 px-1">
            {showCategories
              ? showCategories
              : CATEGORIES.map((c, index) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={index}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                        active === c.name
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-500 border-stone-200 hover:border-[#ffa71c]/50 hover:text-stone-800"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={
                          active === c.name
                            ? "text-[#ffa71c]"
                            : "text-stone-400"
                        }
                      />
                      {c.name}
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
                No recipes to show
              </h3>
              <p className="text-stone-500 text-[13.5px] max-w-xs">
                There's nothing here yet. Recipes you add will show up in this
                list.
              </p>
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Link href={"/recipes"}>
              <button className="inline-flex items-center gap-2 border border-stone-300 text-stone-700 text-[13.5px] font-semibold px-6 py-3 rounded-full hover:border-[#ffa71c] hover:text-stone-900 transition-colors">
                View All Recipes
                <ArrowUpRight size={15} />
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
