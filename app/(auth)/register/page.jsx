"use client";
import React, { useState } from "react";
import { Mail, Lock, User, ChefHat } from "lucide-react";
import { SignUpSchema } from "@/app/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/context/token";

/* ---------------------------------------------------------
   FLAVORIZ — Register
   Same warm editorial system: charcoal panel, cream canvas,
   marmalade-orange accent, Fraunces display / Jakarta body.
--------------------------------------------------------- */

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-11 pr-4 py-3 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });
  const { token, setToken } = useAuth();

  const onSubmit = async (data) => {
    try {
      await axios
        .post(`http://localhost:5000/api/v1/user/register`, data)
        .then((res) => {
          console.log(res);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          console.log(token);
          router.push("/");
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="min-h-screen w-full bg-[#f7f7f7] text-stone-900 flex"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-[400px]">
            <div
              className="lg:hidden text-2xl tracking-tight text-stone-900 mb-10 text-center"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Fla<span className="text-[#ffa71c]">voriz</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#a95f00] bg-[#ffa71c]/15 px-3 py-1 rounded-full mb-4">
              <ChefHat size={13} /> Join the table
            </div>
            <h1
              className="text-[28px] sm:text-[30px] leading-tight text-stone-900"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Create your account
            </h1>
            <p className="text-stone-500 text-[14px] mt-2 mb-8">
              It only takes a minute to start sharing.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="text-[13px] font-semibold text-stone-700 mb-1.5 block">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    {...register("name")}
                    placeholder="Noor"
                    className={inputClass}
                  />
                  <p>{errors.name?.message}</p>
                </div>
              </div>

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
                  <p>{errors.email?.message}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[13px] font-semibold text-stone-700 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Create a password"
                    className={inputClass}
                  />
                  <p>{errors.password?.message}</p>
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  ></button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffa71c] text-white font-semibold text-[14.5px] py-3 hover:bg-[#ff9c00] shadow-[0_10px_24px_-8px_rgba(255,167,28,0.6)] transition-colors disabled:opacity-70"
              >
                Create
              </button>
            </form>

            <p className="text-center text-[13.5px] text-stone-500 mt-8">
              Already have an account?{" "}
              <Link href={"/login"}>
                <button className="font-semibold text-[#a95f00] hover:text-stone-900 transition-colors">
                  Log in
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
