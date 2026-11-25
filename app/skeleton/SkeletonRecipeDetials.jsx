import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRecipeDetials() {
  return (
    <div
      className="w-full bg-[#F6F2EA]"
      role="status"
      aria-busy="true"
      aria-label="Loading recipe"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        .sk-bone{overflow:hidden}
        .sk-bone::after{content:"";position:absolute;inset:0;transform:translateX(-100%);
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);
          animation:skSweep 1.5s ease-in-out infinite}
        [dir="rtl"] .sk-bone::after{transform:translateX(100%);animation-name:skSweepRtl}
        @keyframes skSweep{to{transform:translateX(100%)}}
        @keyframes skSweepRtl{to{transform:translateX(-100%)}}
        @media (prefers-reduced-motion:reduce){.sk-bone::after{animation:none}}
      `}</style>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* ───── Hero ───── */}
        <section className="relative">
          <div className="sk-bone relative aspect-[16/10] w-full overflow-hidden rounded-[32px] bg-stone-300/60 sm:aspect-[21/9]">
            <Skeleton className="absolute start-5 top-5 h-8 w-24 rounded-full bg-white/50 sm:start-8 sm:top-7" />
            <Skeleton className="absolute end-5 top-5 h-10 w-10 rounded-full bg-white/50 sm:end-8 sm:top-7" />
            <div className="absolute inset-x-5 bottom-14 space-y-3 sm:inset-x-10 sm:bottom-16">
              <Skeleton className="h-8 w-3/4 bg-white/50 sm:h-12 sm:w-1/2" />
              <Skeleton className="h-8 w-1/2 bg-white/50 sm:hidden" />
            </div>
          </div>

          {/* stat strip */}
          <div className="relative z-10 mx-3 -mt-8 grid grid-cols-2 divide-stone-200 rounded-3xl border border-stone-200 bg-white py-4 shadow-[0_20px_40px_-24px_rgba(60,40,10,0.25)] sm:mx-10 sm:grid-cols-4 sm:divide-x rtl:sm:divide-x-reverse">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-2 py-2"
              >
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </section>

        {/* ───── Content ───── */}
        <div className="mb-16 mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* about */}
            <section>
              <Skeleton className="mb-5 h-7 w-48" />
              <div className="space-y-2.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-[85%]" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </section>

            {/* gallery */}
            <section>
              <Skeleton className="mb-5 h-7 w-32" />
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
                ))}
              </div>
            </section>

            {/* instructions */}
            <section>
              <Skeleton className="mb-6 h-7 w-44" />
              <ol className="space-y-7">
                {[88, 72, 94, 60].map((w, i) => (
                  <li key={i} className="flex gap-5">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2.5 pt-1.5">
                      <Skeleton className="h-3.5" style={{ width: `${w}%` }} />
                      <Skeleton
                        className="h-3.5"
                        style={{ width: `${w - 28}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ───── Ingredients ───── */}
          <aside>
            <div className="rounded-3xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
              <div className="mb-3 flex items-baseline justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <Skeleton className="mb-5 h-1 w-full rounded-full" />
              <ul className="space-y-1">
                {[70, 85, 60, 78, 66, 82, 55].map((w, i) => (
                  <li key={i} className="flex items-center gap-3 px-2 py-2.5">
                    <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
                    <Skeleton className="h-3.5" style={{ width: `${w}%` }} />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                <div className="space-y-2">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </aside>
        </div>

        {/* ───── Reviews ───── */}
        <section>
          <Skeleton className="mb-6 h-7 w-40" />
          <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="mt-3 flex justify-end">
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="mb-4 rounded-3xl border border-stone-200 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
