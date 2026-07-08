import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/CourseCard'
import FilterBar from '../components/FilterBar'
import { CourseCardSkeleton } from '../components/Skeleton'

export default function Courses() {
  const [searchParams] = useSearchParams()
  const initialDirection = searchParams.get('direction')

  const {
    filters,
    courses,
    total,
    loading,
    error,
    updateFilter,
    setPage,
    resetFilters,
  } = useCourses(
    initialDirection ? { direction: initialDirection } : {}
  )

  const totalPages = Math.ceil(total / filters.pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">课程导览</h1>
        <p className="text-gray-500 text-sm mt-1">
          {total > 0
            ? `共 ${total} 门课程`
            : '按方向、类型、学分筛选你感兴趣的课程'}
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />
      </div>

      {/* 状态处理 */}
      {error && (
        <div className="card text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 空结果 */}
      {!loading && !error && courses.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-medium text-gray-700 mb-2">没有找到相关课程</h3>
          <p className="text-gray-400 text-sm mb-4">试试调整筛选条件或搜索其他关键词</p>
          <button onClick={resetFilters} className="btn-outline text-sm">
            清空筛选条件
          </button>
        </div>
      )}

      {/* 课程列表 */}
      {!loading && !error && courses.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, filters.page - 1))}
                disabled={filters.page <= 1}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500 px-4">
                {filters.page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, filters.page + 1))}
                disabled={filters.page >= totalPages}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
