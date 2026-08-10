import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col justify-center mx-auto gap-4">
      <div className="group flex h-[400px] w-[350px] flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white">
        <div className="relative overflow-hidden">
          <div className="relative aspect-[4/3] bg-stone-200">
            <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur">
              <Skeleton className="h-3 w-16 rounded-full bg-stone-300" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 gap-4">
          <Skeleton className="h-4 w-3/4 rounded-xl bg-stone-300" />
          <Skeleton className="h-4 w-full rounded-full bg-stone-300" />
          <Skeleton className="h-4 w-[80%] rounded-full bg-stone-300" />
        </div>
      </div>
    </div>
  );
}
