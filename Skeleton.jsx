export function CourseCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-14 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-12 bg-gray-200 rounded-full" />
        <div className="h-5 w-10 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export function TeacherCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded mt-3" />
        </div>
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="card space-y-3">
        <div className="h-7 w-48 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
