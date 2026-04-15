export default function AdBanner({ label = "광고" }: { label?: string }) {
  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[100px] flex flex-col items-center justify-center p-4 my-4 group overflow-hidden relative transition-colors">
      <span className="absolute top-2 left-3 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider">{label}</span>
      <div className="text-zinc-400 dark:text-zinc-500 text-sm font-medium animate-pulse transition-colors">
        Google AdSense Slot
      </div>
      {/* 나중에 애드센스 스크립트가 들어갈 위치 */}
    </div>
  );
}

