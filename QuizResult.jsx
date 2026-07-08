import { Link, useLocation, Navigate } from 'react-router-dom'
import { BookOpen, ArrowRight, RefreshCw } from 'lucide-react'
import { HOLLAND_TYPES, DIRECTION_MAP, DIRECTION_DETAILS } from '../constants/holland'
import StarRating from '../components/StarRating'

export default function QuizResult() {
  const location = useLocation()
  const result = location.state?.result

  if (!result) {
    return <Navigate to="/quiz" replace />
  }

  const { typeCode, typeLabel, typeDescription, primaryType, secondaryType, allScores, direction } =
    result

  // 将所有维度得分从高到低排列
  const sortedScores = Object.entries(allScores || {})
    .sort((a, b) => b[1] - a[1])
  const maxScore = sortedScores.length > 0 ? sortedScores[0][1] : 1

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-20 md:pb-12">
      {/* 主结果卡片 */}
      <div className="card text-center mb-8 border-primary-200">
        <div className="text-5xl mb-4">{primaryType?.icon}</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{typeLabel}</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
            {primaryType?.fullLabel}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            {secondaryType?.fullLabel}
          </span>
        </div>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">{typeDescription}</p>

        {/* 性格优势 */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-left">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">
              {primaryType?.icon} {primaryType?.label}型优势
            </h3>
            <p className="text-sm text-blue-700">{primaryType?.strengths}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-purple-800 mb-1">
              {secondaryType?.icon} {secondaryType?.label}型优势
            </h3>
            <p className="text-sm text-purple-700">{secondaryType?.strengths}</p>
          </div>
        </div>
      </div>

      {/* 推荐方向 */}
      {direction && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            📌 推荐发展方向
          </h2>
          <p className="text-gray-500 text-sm mb-6">{direction.description}</p>

          <h3 className="text-base font-medium text-gray-800 mb-3">推荐课程</h3>
          <div className="space-y-3">
            {direction.courses?.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{course.name}</p>
                  <span className="text-xs text-gray-400">{course.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-primary-600 font-medium">{course.credit} 学分</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to={`/courses?direction=${direction.label}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <BookOpen size={18} />
              查看该方向全部课程
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* 六维度得分 */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">你的六维度得分</h2>
        <div className="space-y-3">
          {sortedScores.map(([code, score]) => {
            const info = HOLLAND_TYPES[code]
            const barWidth = Math.max((score / maxScore) * 100, 5)
            return (
              <div key={code} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center shrink-0">{info?.icon}</span>
                <span className="text-sm text-gray-700 w-20 shrink-0">{info?.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      code === primaryType?.code || code === secondaryType?.code
                        ? 'bg-primary-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{score}分</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/courses" className="btn-primary text-center">
          浏览全部课程
        </Link>
        <Link to="/quiz" className="btn-outline text-center flex items-center justify-center gap-2">
          <RefreshCw size={16} />
          重新测评
        </Link>
      </div>
    </div>
  )
}
