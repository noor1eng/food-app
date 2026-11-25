import { Suspense } from "react";
import Navbar from "../Navbar";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function websiteLayout({ children }) {
  return (
    <>
      {/* Navbar reads usePathname(), which is dynamic on routes like /recipedetails/[id] */}
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}
