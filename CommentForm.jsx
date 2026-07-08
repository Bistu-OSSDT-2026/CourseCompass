import { useState, useEffect } from 'react'
import StarRating from './StarRating'

const GRADING_OPTIONS = ['', '宽松', '正常', '严格']
const SEMESTER_OPTIONS = ['', '2024-2025秋', '2024-2025春', '2025-2026秋', '2025-2026春']

export default function CommentForm({ courseId, onSubmit }) {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [grading, setGrading] = useState('')
  const [semester, setSemester] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 从 sessionStorage 恢复昵称
  useEffect(() => {
    const saved = sessionStorage.getItem('cc_nickname')
    if (saved) setNickname(saved)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('请输入评价内容')
      return
    }
    if (content.trim().length < 10) {
      setError('评价内容至少 10 个字')
      return
    }
    if (rating === 0) {
      setError('请给课程打分')
      return
    }

    if (nickname.trim()) {
      sessionStorage.setItem('cc_nickname', nickname.trim())
    }

    setSubmitting(true)
    try {
      await onSubmit(courseId, {
        user_nickname: nickname.trim() || '匿名同学',
        content: content.trim(),
        rating,
        difficulty: difficulty || undefined,
        grading: grading || undefined,
        semester: semester || undefined,
      })
      // 重置表单
      setContent('')
      setRating(0)
      setDifficulty(0)
      setGrading('')
      setSemester('')
    } catch (e) {
      setError(e.message || '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-base font-semibold text-gray-900">发表评论</h3>

      {/* 昵称 */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">昵称 <span className="text-gray-400">(选填)</span></label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="默认为「匿名同学」"
          maxLength={30}
          className="input-field"
        />
      </div>

      {/* 评分区 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">总体评分 <span className="text-red-400">*</span></label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">课程难度 <span className="text-gray-400">(选填)</span></label>
          <StarRating value={difficulty} onChange={setDifficulty} size="lg" />
          {difficulty > 0 && (
            <span className="text-xs text-gray-400">
              {difficulty <= 2 ? '极难' : difficulty === 3 ? '适中' : '轻松'}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">给分风格 <span className="text-gray-400">(选填)</span></label>
          <div className="flex gap-2">
            {GRADING_OPTIONS.filter(Boolean).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setGrading(opt === grading ? '' : opt)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  grading === opt
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 学期选择 */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">选课学期 <span className="text-gray-400">(选填)</span></label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="input-field w-auto"
        >
          {SEMESTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt || '请选择'}</option>
          ))}
        </select>
      </div>

      {/* 评价内容 */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">评价内容 <span className="text-red-400">*</span></label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的选课体验、老师风格、作业量等（10-500字）"
          rows={4}
          maxLength={500}
          className="input-field resize-none"
        />
        <div className="text-xs text-gray-400 mt-1 text-right">{content.length}/500</div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>
      )}

      {/* 提交按钮 */}
      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? '提交中...' : '提交评论'}
      </button>
    </form>
  )
}
