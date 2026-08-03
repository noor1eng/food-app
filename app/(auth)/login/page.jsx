"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { LoginSchema } from "@/app/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/token";

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-11 pr-4 py-3 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10";

export default function LoginPage() {
  const router = useRouter();
  const { token, setToken } = useAuth();
  console.log(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await axios
        .post("http://localhost:5000/api/v1/user/login", data)
        .then((res) => {
          setToken(res.data.token);
          console.log(res);
          localStorage.setItem("token", res.data.token);
          router.push("/");
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className="min-h-screen w-full bg-[#f7f7f7] text-stone-900 flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
        <div className="w-full max-w-[400px]">
          {/* mobile logo */}
          <div
            className="lg:hidden text-2xl tracking-tight text-stone-900 mb-10 text-center"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Fla<span className="text-[#ffa71c]">voriz</span>
          </div>

          <h1
            className="text-[28px] sm:text-[30px] leading-tight text-stone-900"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Welcome back
          </h1>
          <p className="text-stone-500 text-[14px] mt-2 mb-8">
            Log in to keep cooking up something great.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="text-[13px] font-semibold text-stone-700 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-stone-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffa71c] text-stone-900 font-semibold text-[14.5px] py-3 hover:bg-[#ff9c00] shadow-[0_10px_24px_-8px_rgba(255,167,28,0.6)] transition-colors disabled:opacity-70"
            >
              logIn
            </button>
          </form>

          <p className="text-center text-[13.5px] text-stone-500 mt-8">
            Don't have an account?{" "}
            <Link href="register">
              <button className="font-semibold text-[#a95f00] hover:text-stone-900 transition-colors">
                Sign up for free
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
