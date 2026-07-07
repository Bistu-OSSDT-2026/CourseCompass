import { Link } from 'react-router-dom'
import StarRating from './StarRating'

export default function CourseCard({ course }) {
  if (!course) return null

  const typeColors = {
    '专业必修': 'bg-blue-100 text-blue-700',
    '专业选修': 'bg-green-100 text-green-700',
    '公共必修': 'bg-purple-100 text-purple-700',
    '公共选修': 'bg-orange-100 text-orange-700',
  }

  const typeColor = typeColors[course.type] || 'bg-gray-100 text-gray-700'

  return (
    <Link
      to={`/courses/${course.id}`}
      className="card block hover:border-primary-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {course.name}
        </h3>
        <span className="text-xs text-gray-400 ml-2 shrink-0">{course.code}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
          {course.type}
        </span>
        <span className="text-xs text-gray-500">{course.credit} 学分</span>
        <span className="text-xs text-gray-400">{course.grade}</span>
      </div>

      {course.direction && (
        <p className="text-xs text-primary-600 mb-3">{course.direction}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
            {course.teacher?.name?.[0] || 'T'}
          </div>
          <span className="text-sm text-gray-600 truncate">
            {course.teacher?.name || '未知教师'}
            {course.teacher?.title && (
              <span className="text-xs text-gray-400 ml-1">{course.teacher.title}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StarRating value={course.avg_rating || 0} size="sm" readonly />
          <span className="text-xs text-gray-400">
            {course.comment_count || 0}条评价
          </span>
        </div>
      </div>
    </Link>
  )
}
