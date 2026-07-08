import { useTeachers } from '../hooks/useTeachers'
import TeacherCard from '../components/TeacherCard'
import { TeacherCardSkeleton } from '../components/Skeleton'
import { Search } from 'lucide-react'

const DEPARTMENTS = ['', '计算机学院', '数学学院', '管理学院', '外国语学院', '电子信息学院']

export default function Teachers() {
  const { params, teachers, total, loading, error, updateParam, setPage, resetParams } =
    useTeachers()

  const totalPages = Math.ceil(total / params.pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">教师列表</h1>
        <p className="text-gray-500 text-sm mt-1">
          {total > 0 ? `共 ${total} 位教师` : '查看授课教师的详细信息'}
        </p>
      </div>

      {/* 筛选 */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={params.keyword || ''}
            onChange={(e) => updateParam('keyword', e.target.value)}
            placeholder="搜索教师姓名或研究方向..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={params.department || ''}
            onChange={(e) => updateParam('department', e.target.value || null)}
            className="input-field w-auto text-sm py-2"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d || '全部院系'}</option>
            ))}
          </select>

          {(params.keyword || params.department) && (
            <button
              onClick={resetParams}
              className="text-xs text-red-500 hover:text-red-600 px-2 py-1.5"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      {/* 状态 */}
      {error && (
        <div className="card text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TeacherCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && teachers.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">👤</p>
          <h3 className="text-lg font-medium text-gray-700 mb-2">没有找到相关教师</h3>
          <p className="text-gray-400 text-sm">试试不同的搜索词或院系</p>
        </div>
      )}

      {!loading && !error && teachers.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, params.page - 1))}
                disabled={params.page <= 1}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-30"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500 px-4">
                {params.page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, params.page + 1))}
                disabled={params.page >= totalPages}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-30"
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
