import StarRating from './StarRating'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CommentList({ comments = [], sort = 'latest', onSortChange, loading = false }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!comments.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-base">还没有人评价，来做第一个</p>
      </div>
    )
  }

  return (
    <div>
      {/* 排序切换 */}
      {onSortChange && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">排序：</span>
          {[
            { value: 'latest', label: '最新' },
            { value: 'highest', label: '最高评分' },
            { value: 'lowest', label: '最低评分' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                sort === opt.value
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="card !p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  {(c.user_nickname || c.nickname)?.[0] || '匿'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.user_nickname || c.nickname || '匿名同学'}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <StarRating value={c.rating || 0} size="sm" readonly />
                    {c.semester && (
                      <span className="text-xs text-gray-400">{c.semester}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{formatDate(c.created_at)}</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>

            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-50">
              {c.difficulty && (
                <span className="text-xs text-gray-400">
                  难度：
                  <span className="text-gray-600 font-medium">{'★'.repeat(c.difficulty)}{'☆'.repeat(5 - c.difficulty)}</span>
                </span>
              )}
              {c.grading && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    c.grading === '宽松'
                      ? 'bg-green-50 text-green-600'
                      : c.grading === '严格'
                      ? 'bg-red-50 text-red-500'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  给分：{c.grading}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
