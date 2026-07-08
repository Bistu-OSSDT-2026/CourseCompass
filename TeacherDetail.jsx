import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Mail, Globe } from 'lucide-react'
import { getTeacherDetail } from '../api/teachers'
import { DetailSkeleton } from '../components/Skeleton'

const MOCK_DETAIL = {
  id: 1,
  name: '张明',
  title: '副教授',
  department: '计算机学院',
  research: '分布式系统、云计算、边缘计算',
  email: 'zhangming@university.edu.cn',
  profile_url: 'https://cs.university.edu.cn/faculty/zhangming',
  courses: [
    { id: 1, name: '数据结构', code: 'CS201', credit: 3, type: '专业必修' },
    { id: 4, name: '计算机网络', code: 'CS302', credit: 3, type: '专业必修' },
    { id: 10, name: '人机交互', code: 'CS305', credit: 2, type: '专业选修' },
  ],
}

export default function TeacherDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTeacherDetail(id)
      setTeacher(data || MOCK_DETAIL)
    } catch {
      setTeacher(MOCK_DETAIL)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <DetailSkeleton />
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">教师信息不存在</p>
        <button onClick={() => navigate(-1)} className="btn-outline mt-4">
          返回
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 text-sm mb-4"
      >
        <ArrowLeft size={16} />
        返回
      </button>

      {/* 教师基本信息 */}
      <div className="card mb-6">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0">
            {teacher.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {teacher.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                {teacher.title}
              </span>
              <span className="text-sm text-gray-500">{teacher.department}</span>
            </div>
            {teacher.research && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">研究方向：</span>
                {teacher.research}
              </p>
            )}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="flex flex-wrap gap-4 text-sm">
          {teacher.email && (
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600"
            >
              <Mail size={16} />
              {teacher.email}
            </a>
          )}
          {teacher.profile_url && (
            <a
              href={teacher.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600"
            >
              <Globe size={16} />
              官方主页
            </a>
          )}
        </div>
      </div>

      {/* 开设课程 */}
      {teacher.courses && teacher.courses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            开设课程
          </h2>
          <div className="space-y-2">
            {teacher.courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{course.code}</span>
                  <span className="text-sm font-medium text-gray-800">{course.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                    {course.type}
                  </span>
                </div>
                <span className="text-sm text-primary-600 font-medium">
                  {course.credit} 学分
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
