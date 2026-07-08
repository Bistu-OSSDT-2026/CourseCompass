import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, User, Clock, Tag } from 'lucide-react'
import { getCourseDetail, getCourseComments, postComment } from '../api/courses'
import StarRating from '../components/StarRating'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'
import { DetailSkeleton } from '../components/Skeleton'

// 降级模拟数据
const MOCK_DETAIL = {
  id: 1,
  name: '数据结构',
  code: 'CS201',
  credit: 3.0,
  type: '专业必修',
  department: '计算机学院',
  grade: '大二',
  description:
    '本课程介绍基本数据结构与算法，包括线性表、栈、队列、树、图等基础结构及其在计算机科学中的应用。通过理论分析与编程实践相结合，培养学生选择合适数据结构解决实际问题的能力。',
  holland_tags: ['R', 'I'],
  direction: '技术研发方向',
  avg_rating: 4.2,
  comment_count: 15,
  difficulty_avg: 3.8,
  teacher: {
    id: 1,
    name: '张明',
    title: '副教授',
    department: '计算机学院',
  },
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [comments, setComments] = useState([])
  const [commentSort, setCommentSort] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCourseDetail(id)
      setCourse(data || MOCK_DETAIL)
    } catch (e) {
      // 降级使用模拟数据
      setCourse(MOCK_DETAIL)
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true)
    try {
      // 将前端排序值映射为后端参数
      const sortMap = {
        latest: { sort_by: 'created_at', sort_order: 'desc' },
        highest: { sort_by: 'rating', sort_order: 'desc' },
        lowest: { sort_by: 'rating', sort_order: 'asc' },
      }
      const sortParams = sortMap[commentSort] || sortMap.latest
      const data = await getCourseComments(id, sortParams)
      setComments(data?.comments || [])
    } catch {
      setComments([])
    } finally {
      setCommentsLoading(false)
    }
  }, [id, commentSort])

  useEffect(() => {
    fetchDetail()
    fetchComments()
  }, [fetchDetail, fetchComments])

  const handleCommentSubmit = async (courseId, data) => {
    await postComment(courseId, data)
    // 评论区刷新
    await fetchComments()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <DetailSkeleton />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">课程不存在</p>
        <button onClick={() => navigate(-1)} className="btn-outline mt-4">
          返回
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 text-sm mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        返回
      </button>

      {/* 课程基本信息 */}
      <div className="card mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.name}</h1>
            <p className="text-sm text-gray-400">{course.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating value={course.avg_rating || 0} size="lg" readonly />
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {course.type}
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
            <BookOpen size={12} /> {course.credit} 学分
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1">
            <Clock size={12} /> {course.grade}
          </span>
          {course.direction && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
              {course.direction}
            </span>
          )}
          {course.holland_tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
            >
              {tag}型
            </span>
          ))}
        </div>

        {/* 课程简介 */}
        {course.description && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Tag size={14} />
              课程简介
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
          </div>
        )}

        {/* 任课教师 */}
        {course.teacher && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-base font-bold">
              {course.teacher.name?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {course.teacher.name}
                <span className="text-xs text-gray-400 ml-2">{course.teacher.title}</span>
              </p>
              <p className="text-xs text-gray-400">{course.teacher.department}</p>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600">{course.comment_count || 0}</div>
            <div className="text-xs text-gray-400">条评价</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600">{course.avg_rating?.toFixed(1) || '-'}</div>
            <div className="text-xs text-gray-400">综合评分</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600">
              {course.difficulty_avg?.toFixed(1) || '-'}
            </div>
            <div className="text-xs text-gray-400">平均难度</div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">课程评价</h2>

        <CommentForm courseId={id} onSubmit={handleCommentSubmit} />

        <CommentList
          comments={comments}
          sort={commentSort}
          onSortChange={setCommentSort}
          loading={commentsLoading}
        />
      </div>
    </div>
  )
}
