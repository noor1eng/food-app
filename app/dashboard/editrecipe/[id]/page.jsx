"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/context/token";

function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <label className="text-[13px] font-semibold text-stone-700">
        {children}
      </label>
      {hint && <span className="text-[11px] text-stone-400">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    time: "",
    difficulty: "",
    ingrediaint: "",
    instructions: "",
    coverImage: null,
  });
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("idle");
  const [category, setCategory] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!recipeId) return;

    const loadRecipe = async () => {
      try {
        const recipe = await axios.get(
          `http://localhost:5000/api/v1/recipe/${recipeId}`,
        );
        const categories = await axios.get(
          "http://localhost:5000/api/v1/category",
        );
        setCategory(categories.data || []);
        setForm({
          title: recipe.data.title,
          description: recipe.data.description || "",
          category: recipe.data.category || "",
          time: recipe.data.time || "",
          difficulty: recipe.data.difficulty || "",
          ingrediaint: recipe.data.ingrediaint || "",
          instructions: recipe.data.instructions || "",
          coverImage: recipe.data.coverImage,
        });
        setPreview(form.coverImage);
      } catch (err) {
        console.error("Error loading recipe:", err);
      }
    };

    loadRecipe();
  }, [recipeId]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverRemove = () => {
    if (form.coverImage && preview) {
      URL.revokeObjectURL(preview);
    }
    setFileName("");
    updateField("coverImage", null);
    setPreview(form.coverImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeId) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("time", form.time);
    formData.append("difficulty", form.difficulty);
    formData.append("ingrediaint", form.ingrediaint);
    formData.append("instructions", form.instructions);
    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    try {
      setStatus("saving");
      await axios.put(
        `http://localhost:5000/api/v1/recipe/${recipeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setStatus("saved");
      router.push("/dashboard/myrecipe");
    } catch (err) {
      console.error("Error updating recipe:", err);
      setStatus("error");
    }
  };

  const categoryOptions = categories.length
    ? categories
    : category.length
      ? category
      : [];
  const statusText =
    status === "saving"
      ? "Saving changes..."
      : status === "saved"
        ? "Saved successfully."
        : status === "error"
          ? "Save failed. Try again."
          : "Ready to save your changes.";

  return (
    <div
      className="min-h-screen w-full bg-[#f7f7f7] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex">
        <div className="flex-1 min-w-0">
          <main className="px-6 lg:px-10 py-8 max-w-6xl mx-auto pb-32">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                  <CheckCircle2 size={13} /> Editing recipe
                </div>
                <h1
                  className="text-[32px] leading-tight text-stone-900"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {form.title}
                </h1>
                <p className="text-stone-500 text-[14px] mt-1.5">
                  Update your recipe details, and keep the current cover unless
                  you replace it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/dashboard/myrecipe")}
                className="rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-stone-700 hover:bg-stone-100 transition"
              >
                Back to recipes
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)]">
                  <h3
                    className="text-[15px] font-semibold text-stone-800 mb-5"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Recipe information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <FieldLabel>Recipe title</FieldLabel>
                      <input
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <FieldLabel>Description</FieldLabel>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        rows={4}
                        className={inputClass + " resize-none"}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <FieldLabel>Category</FieldLabel>
                        <div className="relative">
                          <select
                            value={form.category}
                            onChange={(e) =>
                              updateField("category", e.target.value)
                            }
                            className={inputClass + " appearance-none pr-9"}
                          >
                            <option value="">Select category</option>
                            {categoryOptions.map((categoryItem) => (
                              <option
                                key={categoryItem._id}
                                value={categoryItem._id}
                              >
                                {categoryItem.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                          />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Cooking time</FieldLabel>
                        <div className="relative">
                          <Clock
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                          />
                          <input
                            value={form.time}
                            onChange={(e) =>
                              updateField("time", e.target.value)
                            }
                            placeholder="30 min"
                            className={inputClass + " pl-9"}
                          />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Difficulty</FieldLabel>
                        <div className="relative">
                          <select
                            value={form.difficulty}
                            onChange={(e) =>
                              updateField("difficulty", e.target.value)
                            }
                            className={inputClass + " appearance-none pr-9"}
                          >
                            <option value="">Select difficulty</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-stone-200 bg-white p-5 sm:p-6 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)]">
                  <h3
                    className="text-[15px] font-semibold text-stone-800 mb-5"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Ingredients & instructions
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <FieldLabel>Ingredients</FieldLabel>
                      <textarea
                        value={form.ingrediaint}
                        onChange={(e) =>
                          updateField("ingrediaint", e.target.value)
                        }
                        placeholder="List ingredients one per line"
                        rows={5}
                        className={inputClass + " resize-none"}
                      />
                    </div>
                    <div>
                      <FieldLabel>Instructions</FieldLabel>
                      <textarea
                        value={form.instructions}
                        onChange={(e) =>
                          updateField("instructions", e.target.value)
                        }
                        placeholder="Explain the steps in order"
                        rows={6}
                        className={inputClass + " resize-none"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3
                        className="text-[15px] font-semibold text-stone-800"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        Cover image
                      </h3>
                      <p className="text-[12px] text-stone-500 mt-1">
                        Upload a new image or keep the current one.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#fff4e3] px-3 py-2 text-[13px] font-semibold text-[#a95f00] transition hover:bg-[#fff1da]">
                      <ImageIcon size={16} /> Replace
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            coverImage: e.target.files[0],
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="relative overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50 aspect-[4/3]">
                    {typeof form.coverImage === "string" ? (
                      <Image
                        src={`http://localhost:5000/images/${encodeURIComponent(form.coverImage)}`}
                        alt={form.title}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                    ) : form.coverImage instanceof File ? (
                      <Image
                        src={URL.createObjectURL(form.coverImage)}
                        alt={form.title}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-stone-400">
                        No cover selected
                      </div>
                    )}
                  </div>

                  {fileName ? (
                    <div className="mt-3 flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-600">
                      <span>{fileName}</span>
                      <button
                        type="button"
                        onClick={handleCoverRemove}
                        className="text-stone-500 hover:text-stone-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-[28px] border border-stone-200/80 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6 lg:col-span-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 text-white rounded-xl text-[13.5px] font-semibold bg-[#ffa71c]  hover:bg-[#ff9c00] shadow-[0_8px_20px_-6px_rgba(255,167,28,0.6)] transition-colors"
                >
                  Save Recipe
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/myrecipe")}
                  className="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
