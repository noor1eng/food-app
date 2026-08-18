"use client";

import axios from "axios";
import { ImagePlus, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { t } from "@/app/il8n";

export default function AddCategory() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const inputClass =
    "w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.75 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10 shadow-sm";

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("http://localhost:5000/api/v1/category", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/dashboard/category");
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="z-50 flex items-center justify-center px-3 py-4 backdrop-blur-sm sm:px-4">
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 bg-[linear-gradient(135deg,_#fff7e8_0%,_#fffdf9_100%)] px-4 py-4 sm:px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ffa71c]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a95f00]">
              <Sparkles size={13} /> {t("categories.newCategory")}
            </div>
            <h2
              className="mt-2 text-[22px] text-stone-900 sm:text-[24px]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {t("categories.form.title")}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-stone-200 bg-white p-2 text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="space-y-4 rounded-[24px] border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
                {t("categories.form.categoryName")}
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Healthy Comfort"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
                {t("categories.form.description")}
              </label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Tell people what makes this category special"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="rounded-2xl border border-stone-200 px-4 py-2.5 text-[13px] font-semibold text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-[#ffa71c] px-4 py-2.5 text-[13px] font-semibold text-stone-900 shadow-[0_10px_24px_-10px_rgba(255,167,28,0.65)] transition hover:bg-[#ff9c00] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? t("dashboard.status.saving")
                  : t("categories.form.save")}
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.25)] sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <ImagePlus size={16} className="text-[#a95f00]" />
              <h3
                className="text-[15px] font-semibold text-stone-800"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {t("categories.form.coverImage")}
              </h3>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-stone-300 bg-stone-50/70 px-4 py-10 text-center transition hover:border-[#ffa71c] hover:bg-[#fff8ec]">
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleImageSelect}
              />
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffa71c]/15">
                <ImagePlus size={20} className="text-[#a95f00]" />
              </div>
              <p className="text-[13.5px] font-medium text-stone-700">
                {t("categories.form.upload")}
              </p>
              <p className="mt-1 text-[11.5px] text-stone-400">
                {t("categories.form.formats")}
              </p>
            </label>

            {preview ? (
              <div className="mt-4 overflow-hidden rounded-[20px] border border-stone-200">
                <img
                  src={preview}
                  alt="Category preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-dashed border-stone-200 bg-stone-50/70 p-4 text-center text-[12.5px] text-stone-400">
                {t("categories.form.preview")}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
