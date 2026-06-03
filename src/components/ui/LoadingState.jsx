/**
 * LoadingState — skeleton card grid while data loads
 */
export default function LoadingState({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-text w-3/4" />
              <div className="skeleton-text w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="skeleton-text w-full" />
            <div className="skeleton-text w-5/6" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-5 w-16 rounded-md" />
            <div className="skeleton h-5 w-20 rounded-md" />
            <div className="skeleton h-5 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
