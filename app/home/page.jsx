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
  Icon,
} from "lucide-react";
import Navbar from "../Navbar";
import Link from "next/link";
import axios from "axios";

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

const RECIPES = [
  {
    title: "Fresh Salad with Tahini Sauce",
    views: "250+",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Chili con Carne with Nachos Chips",
    views: "150+",
    img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Sour & Spicy Korean Kimchi",
    views: "200+",
    img: "https://images.unsplash.com/photo-1583224964978-2257b960c3d6?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Flat Noodles with Shrimp Veggie",
    views: "200+",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Cauliflower Steak Chimichurri Spices",
    views: "150+",
    img: "https://images.unsplash.com/photo-1540420773420-4d0c2a6e6dc8?q=80&w=600&auto=format&fit=crop",
  },
];

function RecipeCard({ title, views, img, highlight, description }) {
  if (highlight) {
    return (
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#ffb646] to-[#ff9c1f] p-6 flex flex-col justify-between min-h-[300px]">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/15 px-2.5 py-1 rounded-full mb-4">
            <Eye size={12} /> {views}
          </span>
          <h3
            className="text-[21px] leading-snug text-white mb-2"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
          >
            {title}
          </h3>
          <p className="text-[13px] text-white/85 leading-relaxed max-w-[85%]">
            {description}
          </p>
        </div>
        <button className="self-start inline-flex items-center gap-2 bg-stone-900 text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-full hover:bg-black transition-colors">
          See Complete Recipe
          <ArrowUpRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-stone-100 min-h-[300px]">
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />

      <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">
        <Eye size={12} /> {views}
      </span>

      <div className="absolute top-4 left-4 right-16">
        <h3
          className="text-[19px] leading-snug text-stone-900"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h3>
      </div>

      <button className="absolute left-4 right-4 bottom-4 inline-flex items-center justify-center gap-2 bg-stone-900/90 backdrop-blur text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-full hover:bg-black transition-colors">
        See Complete Recipe
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState("All Types");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      await axios.get("http://localhost:5000/api/v1/category").then((res) => {
        setCategories(res.data);
      });
    }
    fetchCategories();
  }, []);

  const showCategories = categories?.map((categroy) => {
    console.log(categroy);

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

  return (
    <>
      <Navbar />
      <div
        className="w-full bg-[#f7f7f7]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* Hero banner */}
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#eef1ea] to-[#e4e8dd] min-h-[220px] sm:min-h-[260px] flex items-center">
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
              <Link href="/dashboard/addrecipe">
                <button className="hidden sm:inline-flex items-center mt-5 gap-1.5 bg-stone-800 text-white text-[12.5px] font-semibold pl-3.5 pr-4 py-2.5 rounded-full hover:bg-black transition-colors">
                  <Plus size={15} className="text-[#ffa71c]" />
                  Add Recipe
                </button>
              </Link>
            </div>
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-[55%] lg:w-[48%]">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop"
                alt="Seared tuna salad"
                className="w-full h-full object-cover"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECIPES.slice(0, 3).map((r) => (
              <RecipeCard key={r.title} {...r} />
            ))}
            {RECIPES.slice(3, 4).map((r) => (
              <RecipeCard key={r.title} {...r} />
            ))}
            <RecipeCard
              highlight
              title="Classic Italian Beef Maltagliati"
              views="180+"
              description="Layers of spicy goodness, hearty meat, and savory sauce. A timeless favorite with Maltagliati pasta."
            />
            {RECIPES.slice(4, 5).map((r) => (
              <RecipeCard key={r.title} {...r} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button className="inline-flex items-center gap-2 border border-stone-300 text-stone-700 text-[13.5px] font-semibold px-6 py-3 rounded-full hover:border-[#ffa71c] hover:text-stone-900 transition-colors">
              View All Recipes
              <ArrowUpRight size={15} />
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
