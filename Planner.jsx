import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'
import creditRules from '../data/credit_rules.json'

const GRADE_OPTIONS = ['大一', '大二', '大三', '大四']

// 学分差额计算（纯前端函数）
function calcCreditGap(completed) {
  return creditRules.rules.map((rule) => {
    const done = completed[rule.category] || 0
    return {
      ...rule,
      completed: done,
      gap: Math.max(0, rule.min_credit - done),
    }
  })
}

// 模拟推荐课程
const SUGGESTED_COURSES = {
  required: [
    { name: '数据结构', credit: 3 },
    { name: '操作系统', credit: 3 },
    { name: '计算机网络', credit: 3 },
  ],
  major_elective: [
    { name: '嵌入式系统', credit: 2 },
    { name: '数据挖掘', credit: 2 },
    { name: '人工智能导论', credit: 2 },
  ],
  general_elective: [
    { name: '管理学原理', credit: 2 },
    { name: '心理学导论', credit: 2 },
    { name: '市场营销学', credit: 2 },
  ],
  practice: [
    { name: '毕业设计', credit: 6 },
    { name: '专业实习', credit: 2 },
  ],
}

export default function Planner() {
  const [grade, setGrade] = useState('大一')
  const [completed, setCompleted] = useState({
    required: 0,
    major_elective: 0,
    general_elective: 0,
    practice: 0,
  })
  const [showResult, setShowResult] = useState(false)

  const gaps = useMemo(() => {
    if (!showResult) return null
    return calcCreditGap(completed)
  }, [completed, showResult])

  const totalCompleted = Object.values(completed).reduce((s, v) => s + v, 0)
  const totalGap = gaps
    ? gaps.reduce((s, g) => s + g.gap, 0)
    : 0
  const totalRequired = creditRules.rules.reduce((s, r) => s + r.min_credit, 0)

  const handleInputChange = (category, value) => {
    const num = Math.max(0, Number(value) || 0)
    setCompleted((prev) => ({ ...prev, [category]: num }))
  }

  const handleCalculate = () => {
    setShowResult(true)
  }

  const handleReset = () => {
    setCompleted({ required: 0, major_elective: 0, general_elective: 0, practice: 0 })
    setShowResult(false)
  }

  // 进度百分比
  const progressPercent = totalRequired > 0 ? Math.min(100, (totalCompleted / totalRequired) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator size={28} />
          学分规划器
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          根据完全学分制毕业要求，实时计算学分差额并推荐补足课程
        </p>
      </div>

      {/* 年级选择 */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">当前年级</label>
        <div className="flex gap-2">
          {GRADE_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                grade === g
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 已修学分输入 */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          已修学分
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          请输入你目前已获得的各类学分（含本学期预计获得的学分）
        </p>

        <div className="space-y-4">
          {creditRules.rules.map((rule) => (
            <div key={rule.category} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{rule.label}</label>
                <p className="text-xs text-gray-400">{rule.description}</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <input
                  type="number"
                  min={0}
                  value={completed[rule.category]}
                  onChange={(e) => handleInputChange(rule.category, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-400 whitespace-nowrap">/ {rule.min_credit} 学分</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleCalculate} className="btn-primary flex-1 sm:flex-none">
            计算差额
          </button>
          <button onClick={handleReset} className="btn-outline">
            重置
          </button>
        </div>
      </div>

      {/* 结果展示 */}
      {showResult && gaps && (
        <div className="space-y-6">
          {/* 总览 */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">学分总览</h2>

            {/* 进度条 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  已完成 {totalCompleted} / {totalRequired} 学分
                </span>
                <span className="text-primary-600 font-medium">
                  {progressPercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 各类别详情 */}
            <div className="space-y-3">
              {gaps.map((item) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    item.gap > 0 ? 'bg-red-50' : 'bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.gap > 0 ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {item.completed} / {item.min_credit}
                    </span>
                    {item.gap > 0 && (
                      <span className="text-sm text-red-500 font-medium ml-2">差 {item.gap} 学分</span>
                    )}
                    {item.gap === 0 && (
                      <span className="text-sm text-green-500 font-medium ml-2">已完成 ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalGap > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  你还需要修满 <span className="text-lg font-bold text-primary-600">{totalGap}</span> 学分
                </p>
              </div>
            )}
          </div>

          {/* 推荐补足课程 */}
          {gaps.some((g) => g.gap > 0) && (
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-4">推荐补足课程</h2>
              <div className="space-y-4">
                {gaps
                  .filter((g) => g.gap > 0)
                  .map((g) => (
                    <div key={g.category}>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {g.label}（缺 {g.gap} 学分）
                      </h3>
                      <div className="space-y-2">
                        {(SUGGESTED_COURSES[g.category] || []).map((course, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50"
                          >
                            <span className="text-sm text-gray-700">{course.name}</span>
                            <span className="text-sm text-primary-600 font-medium">
                              {course.credit} 学分
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/courses?type=${g.label}`}
                        className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                      >
                        查看更多 {g.label} →
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
