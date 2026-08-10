import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/token";
import { useRouter } from "next/navigation";
import { t } from "@/app/il8n";

export default function Logout() {
  const router = useRouter();
  const { token, setToken } = useAuth();
  return (
    <button
      className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900 text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-black transition-colors"
      onClick={async () => {
        setToken(null);
        localStorage.removeItem("token");
        router.push("/");
      }}
    >
      <LogOut size={14} />
      {t("nav.signOut")}
    </button>
  );
}
