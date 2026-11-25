import RecipesClient from "./RecipeClient";
import { API } from "@/app/Api/api";
import { cacheLife, cacheTag } from "next/cache";
export const instant = false;

async function getRecipes({ search, category }) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (category) qs.set("category", category);

  const res = await fetch(`${API}recipe?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

async function getCategories() {
  "use cache";
  const res = await fetch(`${API}category`);
  cacheTag("category");
  cacheLife("days"); // 24 ساعة
  if (!res.ok) return [];
  return res.json();
}

export default async function RecipesPage({ searchParams }) {
  const { search = "", category = "" } = await searchParams;

  const [recipes, categories] = await Promise.all([
    getRecipes({ search, category }),
    getCategories(),
  ]);

  return (
    <RecipesClient
      recipes={recipes}
      categories={categories}
      search={search}
      activeCategory={category}
    />
  );
}
