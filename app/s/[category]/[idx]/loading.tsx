export default function PostLoading() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <header className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 space-y-4">
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-7 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 w-14 bg-zinc-100 dark:bg-zinc-800 rounded" />
              ))}
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px] space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-4 bg-zinc-100 dark:bg-zinc-800 rounded ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
          ))}
          <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </article>
      </div>
    </div>
  );
}
