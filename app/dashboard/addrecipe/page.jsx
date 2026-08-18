"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  UploadCloud,
  X,
  Clock,
  ChefHat,
  ImagePlus,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/token";
import { toast } from "@/components/ui/toast";
import { t } from "@/app/il8n";

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
  "w-full rounded-2xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.75 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10 shadow-sm";

function ImageDropzone({ preview, onSelect, onRemove, fileName }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(file, url);
  };

  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-[15px] font-semibold text-stone-800"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Cover image
          </h3>
          <p className="text-[11.5px] text-stone-400 mt-1">
            {t("recipeForm.coverImage.description")}
          </p>
        </div>
        {fileName && (
          <span className="rounded-full bg-[#fff8ec] px-2.5 py-1 text-[10.5px] font-semibold text-[#a95f00]">
            {fileName}
          </span>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="relative cursor-pointer rounded-[20px] border-2 border-dashed border-stone-300 hover:border-[#ffa71c] bg-stone-50/70 hover:bg-[#fff8ec] transition-all flex flex-col items-center justify-center text-center py-10 px-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="w-12 h-12 rounded-full bg-[#ffa71c]/15 flex items-center justify-center mb-3">
          <UploadCloud size={20} className="text-[#a95f00]" />
        </div>
        <p className="text-[13.5px] font-medium text-stone-600">
          {t("recipeForm.coverImage.upload")}
        </p>
        <p className="text-[11.5px] text-stone-400 mt-1">
          {t("recipeForm.coverImage.formats")}
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] border border-stone-200">
            <img
              src={preview}
              alt="Recipe preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/65 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddRecipePage() {
  const initialForm = {
    title: "",
    description: "",
    ingrediaint: "",
    instructions: "",
    coverImage: null,
    images: "",
    category: "",
    time: 1,
    rating: 0,
    difficulty: "",
  };

  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    try {
      axios.get("http://localhost:5000/api/v1/category").then((res) => {
        setCategories(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file, url) => {
    setPreview(url);
    setFileName(file.name);
    updateField("coverImage", file);
  };

  const handleImageRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFileName("");
    updateField("coverImage", null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("ingrediaint", form.ingrediaint);
    formData.append("instructions", form.instructions);
    formData.append("category", form.category);
    formData.append("time", form.time);
    formData.append("difficulty", form.difficulty);
    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    try {
      await axios.post("http://localhost:5000/api/v1/recipe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.add({
        title: "Recipe added",
        description: "Your recipe has been saved successfully.",
        type: "success",
        timeout: 2000,
      });
      handleImageRemove();
      router.push("/dashboard/myrecipe");
    } catch (err) {
      console.error(err);
      toast.add({
        title: "Unable to add recipe",
        description: err?.response?.data?.message || "Please try again later.",
        type: "error",
        timeout: 2000,
      });
    }
  };

  const ShowCategories = categories.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ));

  return (
    <div
      className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,167,28,0.14),_transparent_28%),linear-gradient(135deg,_#fffaf3_0%,_#f7f7f7_55%,_#fdf2e3_100%)] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 pb-32">
        <div className="mb-8 rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ffa71c]/15 px-3 py-1 text-[11.5px] font-semibold text-[#a95f00]">
                <ChefHat size={13} /> {t("dashboard.newRecipe")}
              </div>
              <h1
                className="mt-3 text-[32px] leading-tight text-stone-900 sm:text-[36px]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {t("recipeForm.title")}
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-stone-500">
                {t("recipeForm.description")}
              </p>
            </div>
          </div>
        </div>

        <form
          id="recipe-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)] sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={16} className="text-[#a95f00]" />
                <h3
                  className="text-[15px] font-semibold text-stone-800"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {t("recipeForm.essentials.title")}
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <FieldLabel>
                    {t("recipeForm.essentials.recipeTitle")}
                  </FieldLabel>
                  <input
                    value={form.title}
                    required
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g. Creamy chicken pasta"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>
                    {t("recipeForm.essentials.shortDescription")}
                  </FieldLabel>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe what makes this recipe special"
                    rows={4}
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <FieldLabel>
                      {t("recipeForm.essentials.category")}
                    </FieldLabel>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                        className={inputClass + " appearance-none pr-9"}
                      >
                        <option value="">
                          {t("recipeForm.essentials.selectCategory")}
                        </option>
                        {ShowCategories}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>
                      {t("recipeForm.essentials.cookingTime")}
                    </FieldLabel>
                    <div className="relative">
                      <Clock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="number"
                        min="1"
                        value={form.time}
                        onChange={(e) => updateField("time", e.target.value)}
                        placeholder="30"
                        className={inputClass + " pl-9"}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>
                      {t("recipeForm.essentials.difficulty")}
                    </FieldLabel>
                    <div className="relative">
                      <select
                        value={form.difficulty}
                        onChange={(e) =>
                          updateField("difficulty", e.target.value)
                        }
                        className={inputClass + " appearance-none pr-9"}
                      >
                        <option value="">
                          {t("recipeForm.essentials.selectDifficulty")}
                        </option>
                        <option>{t("recipeForm.essentials.easy")}</option>
                        <option>{t("recipeForm.essentials.medium")}</option>
                        <option>{t("recipeForm.essentials.hard")}</option>
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

            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)] sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <ChefHat size={16} className="text-[#a95f00]" />
                <h3
                  className="text-[15px] font-semibold text-stone-800"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {t("recipeForm.story.title")}
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <FieldLabel>{t("recipeForm.story.ingredients")}</FieldLabel>
                  <textarea
                    value={form.ingrediaint}
                    onChange={(e) => updateField("ingrediaint", e.target.value)}
                    placeholder="List ingredients one per line"
                    rows={5}
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div>
                  <FieldLabel>{t("recipeForm.story.instructions")}</FieldLabel>
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
            <ImageDropzone
              preview={preview}
              onSelect={handleImageSelect}
              onRemove={handleImageRemove}
              fileName={fileName}
            />

            <div className="rounded-[24px] border border-[#ffa71c]/30 bg-[#fff8ec] p-5 shadow-[0_12px_30px_-18px_rgba(255,167,28,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <ImagePlus size={16} className="text-[#a95f00]" />
                <h4 className="text-[13.5px] font-semibold text-stone-800">
                  Photo tip
                </h4>
              </div>
              <p className="text-[12.5px] leading-relaxed text-stone-600">
                Natural light and a warm angle make dishes feel more inviting. A
                clean background helps the food stand out.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-[28px] border border-stone-200/80 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6 lg:col-span-2">
            <button
              type="submit"
              form="recipe-form"
              className="rounded-2xl text-white bg-[#ffa71c] px-6 py-2.5 text-[13.5px] font-semibold  shadow-[0_10px_24px_-10px_rgba(255,167,28,0.65)] transition-all hover:bg-[#ff9c00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("recipeForm.actions.save")}
            </button>
            <button
              type="button"
              className="rounded-2xl px-5 py-2.5 text-[13.5px] font-semibold text-stone-600 transition-colors hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
