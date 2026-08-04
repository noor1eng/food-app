"use client";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { SignUpSchema } from "@/app/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/context/token";

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-stone-50/80 pl-11 pr-4 py-3.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:border-[#ffa71c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,167,28,0.12)]";

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
              Create your account and start cooking.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
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
              </div>
              <p className="mt-1 text-sm text-red-500">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
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
              </div>
              <p className="mt-1 text-sm text-red-500">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-stone-700">
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
              </div>
              <p className="mt-1 text-sm text-red-500">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffa71c] py-3.5 text-[14.5px] font-semibold text-stone-900 transition-all hover:bg-[#ff9c00]"
            >
              Create account
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-stone-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#a95f00] transition-colors hover:text-stone-900"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
