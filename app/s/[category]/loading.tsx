export default function SpaceLoading() {
  return (
    <div className="w-full space-y-6 pb-20 animate-pulse">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-7 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-900 rounded" />
        </div>
        <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900 rounded" />
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex gap-4">
          {['w-12', 'flex-1', 'w-24', 'w-28', 'w-16'].map((w, i) => (
            <div key={i} className={`h-3 ${w} bg-zinc-200 dark:bg-zinc-800 rounded`} />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
            <div className="h-3 w-8 bg-zinc-100 dark:bg-zinc-800 rounded hidden sm:block" />
            <div className="h-3 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded hidden md:block" />
            <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded hidden md:block" />
            <div className="h-3 w-10 bg-zinc-100 dark:bg-zinc-800 rounded hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
