"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/token";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token === null) {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        router.replace("/login");
      }
    }
  }, [token, router]);

  if (!token) {
    return null;
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-3">{children}</main>
      </div>
    </div>
  );
}
