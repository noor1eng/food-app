import { Suspense } from "react";
import EditRecipeClient from "./EditRecipeClient";

export default function EditRecipePage() {
  return (
    <Suspense fallback={null}>
      <EditRecipeClient />
    </Suspense>
  );
}
