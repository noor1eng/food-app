import FavoriteClient from "./FavorateClient";
import { API } from "../../Api/api";
export const instant = false;

async function getFavorites() {
  const res = await fetch(`${API}recipe/favorate`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();
  return <FavoriteClient favorites={favorites} />;
}
