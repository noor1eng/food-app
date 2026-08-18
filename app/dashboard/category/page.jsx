"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/context/token";
import { t } from "@/app/il8n";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [rand, setRand] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/category",
        );
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategory();
  }, [rand]);

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/category/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setRand((prev) => !prev);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,167,28,0.12),_transparent_24%),linear-gradient(135deg,_#fffaf3_0%,_#f7f7f7_55%,_#fdf2e3_100%)] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-[30px] border border-stone-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <div>
            <h1
              className="text-[28px] text-stone-900 sm:text-[32px]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {t("categories.title")}
            </h1>
            <p className="mt-1 text-[14px] text-stone-500">
              {t("categories.description")}
            </p>
          </div>

          <Link href="/dashboard/addcategory">
            <button className="inline-flex items-center gap-1.5 rounded-2xl bg-[#ffa71c] px-5 py-2.5 text-[13.5px] font-semibold text-stone-900 shadow-[0_8px_20px_-8px_rgba(255,167,28,0.6)] transition hover:bg-[#ff9c00]">
              <PlusCircle size={16} /> {t("categories.addCategory")}
            </button>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full rounded-[24px] border border-dashed border-stone-300 bg-white/70 p-10 text-center text-stone-500">
              {t("categories.empty")}
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category._id}
                className="group overflow-hidden rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.2)]"
              >
                {category.image ? (
                  <div className="mb-4 overflow-hidden rounded-3xl border border-stone-200 bg-[#fff4e3] shadow-[inset_0_0_0_1px_rgba(255,167,28,0.2)]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={`http://localhost:5000/images/${encodeURIComponent(category.image)}`}
                        alt={category.name}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex h-36 items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50 text-[13px] text-stone-500">
                    No image available
                  </div>
                )}

                <h3
                  className="text-[17px] text-stone-900"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {category.name}
                </h3>
                <p className="mt-1 text-[12.5px] leading-6 text-stone-400">
                  {category.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-[13px] font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-900">
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2 text-[13px] font-semibold text-red-500 transition hover:bg-red-100"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
