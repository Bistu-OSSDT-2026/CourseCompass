import { Link } from 'react-router-dom'

export default function TeacherCard({ teacher }) {
  if (!teacher) return null

  return (
    <Link
      to={`/teachers/${teacher.id}`}
      className="card block hover:border-primary-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-bold shrink-0">
          {teacher.name?.[0] || 'T'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">
              {teacher.name}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
              {teacher.title}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">{teacher.department}</p>

          {teacher.research && (
            <p className="text-xs text-gray-400 line-clamp-2">{teacher.research}</p>
          )}

          <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>开设 {teacher.course_count || 0} 门课程</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
