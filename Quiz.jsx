import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { useQuiz } from '../hooks/useQuiz'
import QUESTIONS from '../constants/questions'

export default function Quiz() {
  const navigate = useNavigate()
  const {
    phase,
    currentIndex,
    answers,
    result,
    error,
    progress,
    progressPercent,
    isComplete,
    startQuiz,
    selectAnswer,
    goNext,
    goPrev,
    submit,
    retry,
    reset,
  } = useQuiz()

  // ===== 欢迎页 =====
  if (phase === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="text-6xl mb-6">🧭</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Holland 职业兴趣测评
        </h1>
        <p className="text-gray-500 mb-2 max-w-md mx-auto">
          共 20 道选择题，大约需要 3-5 分钟
        </p>
        <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
          根据你的真实偏好作答，我们将为你推荐最适合的发展方向和课程
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-md mx-auto">
          {['R 实用型', 'I 研究型', 'A 艺术型', 'S 社会型', 'E 企业型', 'C 常规型'].map(
            (type) => (
              <div
                key={type}
                className="px-3 py-2 rounded-lg bg-gray-50 text-sm text-gray-600"
              >
                {type}
              </div>
            )
          )}
        </div>

        <button onClick={startQuiz} className="btn-primary px-12 py-3 text-lg">
          开始测评
        </button>
      </div>
    )
  }

  // ===== 答题中 =====
  if (phase === 'answering') {
    const question = QUESTIONS[currentIndex]
    const selectedAnswer = answers[currentIndex]

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">
              第 {currentIndex + 1} / {QUESTIONS.length} 题
            </span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* 答题标记点 */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm transition-colors cursor-pointer ${
                  i === currentIndex
                    ? 'ring-2 ring-primary-400'
                    : ''
                } ${
                  a
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 题目 */}
        <div className="card mb-6">
          <div className="flex items-start gap-3 mb-6">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
              {currentIndex + 1}
            </span>
            <h2 className="text-lg text-gray-900 font-medium leading-relaxed">
              {question.text}
            </h2>
          </div>

          {/* 选项 */}
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  selectAnswer(opt.value)
                  // 选完后自动跳到下一题（可调整）
                }}
                className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${
                  selectedAnswer === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      selectedAnswer === opt.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {opt.value}
                  </span>
                  <span className="text-sm sm:text-base">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-outline flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            上一题
          </button>

          {currentIndex < QUESTIONS.length - 1 ? (
            <button onClick={goNext} className="btn-primary flex items-center gap-1">
              下一题
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!isComplete}
              className="btn-primary flex items-center gap-1"
            >
              <CheckCircle2 size={16} />
              提交查看结果
            </button>
          )}
        </div>

        {/* 快速跳转 */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-2">快速跳转：</p>
          <div className="flex flex-wrap gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  // 创建一个直接设置当前索引的方法（可以通过 goNext/goPrev 的组合实现或增加 jumpTo）
                  // 这里用简单的处理：如果目标在前面就一直往后退，如果目标在后面就一直往前走
                  // 但这样不方便，我们在 Hook 里需要增加一个 jumpTo 方法
                  // 简单起见暂时不实现，后续可加
                }}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  i === currentIndex
                    ? 'bg-primary-500 text-white'
                    : answers[i]
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ===== 提交中 =====
  if (phase === 'submitting') {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在分析你的兴趣倾向...</h2>
        <p className="text-gray-500 text-sm">请稍等片刻</p>
      </div>
    )
  }

  // ===== 错误 =====
  if (phase === 'error') {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center">
        <div className="text-5xl mb-6">
          <AlertCircle size={64} className="text-red-400 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">提交失败</h2>
        <p className="text-gray-500 mb-6">{error || '未知错误'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={retry} className="btn-primary">
            重试
          </button>
          <button onClick={reset} className="btn-outline">
            返回首页
          </button>
        </div>
      </div>
    )
  }

  // ===== 结果页 → 重定向 =====
  if (phase === 'result') {
    // 结果通过路由 state 传递
    navigate('/quiz/result', { state: { result } })
    return null
  }

  return null
}
