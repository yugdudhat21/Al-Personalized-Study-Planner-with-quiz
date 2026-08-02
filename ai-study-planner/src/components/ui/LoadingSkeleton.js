'use client';

export default function LoadingSkeleton({ count = 3, height = "h-24" }) {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${height} w-full rounded-2xl glass-card bg-gray-200/50 dark:bg-gray-800/40 border border-gray-300/20`}
        />
      ))}
    </div>
  );
}
