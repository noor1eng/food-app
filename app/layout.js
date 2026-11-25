import "./globals.css";
import { AuthProvider } from "./context/token";
import { Toaster } from "@/components/ui/toast";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster>{children}</Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
