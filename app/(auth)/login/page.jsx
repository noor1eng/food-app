"use client";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { LoginSchema } from "@/app/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/token";
import { toast } from "@/components/ui/toast";
import { t, useI18n } from "@/app/il8n";

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-stone-50/80 pl-11 pr-4 py-3.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:border-[#ffa71c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,167,28,0.12)]";

export default function LoginPage() {
  const router = useRouter();
  const { token, setToken } = useAuth();
  console.log(token);

  const { language } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        data,
      );
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.add({
        title: t("toast.loginSuccessTitle"),
        description: t("toast.loginSuccessDescription"),
        type: "success",
        timeout: 2000,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.add({
        title: t("toast.loginFailureTitle"),
        description:
          err?.response?.data?.message || t("toast.loginFailureDescription"),
        type: "error",
        timeout: 2000,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-[linear-gradient(135deg,_#fffaf3_0%,_#f7f7f7_100%)] px-4 py-6 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[430px] items-center justify-center">
        <div className="w-full rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(34,34,34,0.24)] sm:p-8">
          <div className="text-center">
            <p
              className="text-[26px] font-semibold tracking-tight text-stone-900"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Flavoriz
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {t("auth.loginTitle")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder={t("auth.emailPlaceholder")}
                  className={inputClass}
                />
              </div>
              <p className="mt-1 text-sm text-red-500">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register("password")}
                  placeholder={t("auth.passwordPlaceholder")}
                  className={inputClass}
                />
              </div>
              <p className="mt-1 text-sm text-red-500">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffa71c] py-3.5 text-[14.5px] font-semibold text-stone-900 transition-all hover:bg-[#ff9c00]"
            >
              {t("auth.login")}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-stone-500">
            {t("auth.noAccount")} {""}
            <Link
              href="/register"
              className="font-semibold text-[#a95f00] transition-colors hover:text-stone-900"
            >
              {t("auth.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
