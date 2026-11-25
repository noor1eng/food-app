import { Suspense } from "react";
import RecipeDetailsClient from "./RecipeDetailsClient";
import { SkeletonRecipeDetials } from "@/app/skeleton/SkeletonRecipeDetials";

export default function RecipeDetailsPage() {
  return (
    <Suspense fallback={<SkeletonRecipeDetials />}>
      <RecipeDetailsClient />
    </Suspense>
  );
}
