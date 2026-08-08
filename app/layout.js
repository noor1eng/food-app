import "./globals.css";
import { AuthProvider } from "./context/token";
import { Toaster } from "@/components/ui/toast";

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
