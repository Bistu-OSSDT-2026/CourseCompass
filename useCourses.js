import { useState, useCallback, useEffect } from 'react'
import { getCourses } from '../api/courses'

// 排序值到后端参数的映射
const SORT_MAP = {
  credit_desc: { sort_by: 'credits', sort_order: 'desc' },
  credit_asc: { sort_by: 'credits', sort_order: 'asc' },
  name_asc: { sort_by: 'name', sort_order: 'asc' },
  rating_desc: { sort_by: 'rating', sort_order: 'desc' },
  default: { sort_by: 'id', sort_order: 'asc' },
}

const defaultFilters = {
  keyword: '',
  direction: null,
  type: null,
  creditRange: [0, 6],
  sort: 'credit_desc',
  page: 1,
  pageSize: 20,
}

export function useCourses(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters })
  const [courses, setCourses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // 构建后端兼容的查询参数
      const sortConfig = SORT_MAP[filters.sort] || SORT_MAP.default
      const params = {
        page: filters.page,
        page_size: filters.pageSize,
        sort_by: sortConfig.sort_by,
        sort_order: sortConfig.sort_order,
      }
      if (filters.keyword) params.keyword = filters.keyword

      const data = await getCourses(params)
      // 后端返回 { courses: [...], pagination: {...} }
      const backendCourses = data?.courses || []
      const pagination = data?.pagination || {}

      // 前端本地筛选（后端暂不支持的筛选字段）
      let filtered = backendCourses
      if (filters.direction) {
        filtered = filtered.filter((c) => c.direction === filters.direction)
      }
      if (filters.type) {
        filtered = filtered.filter((c) => c.type === filters.type)
      }
      const [creditMin, creditMax] = filters.creditRange
      if (creditMin > 0 || creditMax < 6) {
        filtered = filtered.filter(
          (c) => (c.credits || c.credit || 0) >= creditMin && (c.credits || c.credit || 0) <= creditMax
        )
      }

      setCourses(filtered)
      setTotal(pagination.total || filtered.length)
    } catch (e) {
      // 后端不可用时使用模拟数据降级
      if (e.message?.includes('网络') || e.message?.includes('服务器')) {
        const mock = getMockCourses(filters)
        setCourses(mock)
        setTotal(mock.length)
      } else {
        setError(e.message || '加载课程失败')
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))
  }, [])

  const setPage = useCallback((page) => updateFilter('page', page), [updateFilter])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return {
    filters,
    courses,
    total,
    loading,
    error,
    updateFilter,
    setPage,
    resetFilters,
    refetch: fetchCourses,
  }
}

/* ====== 模拟数据（后端不可用时降级使用） ====== */

const MOCK_COURSES = [
  { id: 1, name: '数据结构', code: 'CS201', credit: 3, type: '专业必修', department: '计算机学院', grade: '大二', direction: '技术研发方向', avg_rating: 4.2, comment_count: 15, teacher: { id: 1, name: '张明', title: '副教授' } },
  { id: 2, name: '操作系统', code: 'CS301', credit: 3, type: '专业必修', department: '计算机学院', grade: '大三', direction: '技术研发方向', avg_rating: 4.0, comment_count: 12, teacher: { id: 2, name: '李芳', title: '教授' } },
  { id: 3, name: '计算机组成原理', code: 'CS202', credit: 3, type: '专业必修', department: '计算机学院', grade: '大二', direction: '工程实践方向', avg_rating: 3.8, comment_count: 10, teacher: { id: 3, name: '王强', title: '教授' } },
  { id: 4, name: '计算机网络', code: 'CS302', credit: 3, type: '专业必修', department: '计算机学院', grade: '大三', direction: '技术研发方向', avg_rating: 4.5, comment_count: 20, teacher: { id: 1, name: '张明', title: '副教授' } },
  { id: 5, name: '数据库原理', code: 'CS303', credit: 3, type: '专业必修', department: '计算机学院', grade: '大三', direction: '数据分析方向', avg_rating: 4.3, comment_count: 18, teacher: { id: 4, name: '赵雪', title: '副教授' } },
  { id: 6, name: '高等数学', code: 'MATH101', credit: 4, type: '公共必修', department: '数学学院', grade: '大一', direction: '学术研究方向', avg_rating: 3.5, comment_count: 30, teacher: { id: 5, name: '陈博', title: '教授' } },
  { id: 7, name: '软件工程', code: 'CS401', credit: 3, type: '专业必修', department: '计算机学院', grade: '大四', direction: '产品管理方向', avg_rating: 4.1, comment_count: 8, teacher: { id: 2, name: '李芳', title: '教授' } },
  { id: 8, name: '嵌入式系统', code: 'CS304', credit: 2, type: '专业选修', department: '计算机学院', grade: '大三', direction: '工程实践方向', avg_rating: 3.9, comment_count: 6, teacher: { id: 3, name: '王强', title: '教授' } },
  { id: 9, name: '数据挖掘', code: 'CS402', credit: 2, type: '专业选修', department: '计算机学院', grade: '大四', direction: '数据分析方向', avg_rating: 4.4, comment_count: 11, teacher: { id: 4, name: '赵雪', title: '副教授' } },
  { id: 10, name: '人机交互', code: 'CS305', credit: 2, type: '专业选修', department: '计算机学院', grade: '大三', direction: '创意设计方向', avg_rating: 4.0, comment_count: 7, teacher: { id: 1, name: '张明', title: '副教授' } },
  { id: 11, name: '人工智能导论', code: 'CS403', credit: 2, type: '专业选修', department: '计算机学院', grade: '大四', direction: '学术研究方向', avg_rating: 4.6, comment_count: 14, teacher: { id: 6, name: '刘洋', title: '教授' } },
  { id: 12, name: '概率论与数理统计', code: 'MATH201', credit: 3, type: '公共必修', department: '数学学院', grade: '大二', direction: '数据分析方向', avg_rating: 3.7, comment_count: 22, teacher: { id: 5, name: '陈博', title: '教授' } },
]

function getMockCourses(filters) {
  let list = [...MOCK_COURSES]

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        c.teacher.name.toLowerCase().includes(kw)
    )
  }

  if (filters.direction) {
    list = list.filter((c) => c.direction === filters.direction)
  }

  if (filters.type) {
    list = list.filter((c) => c.type === filters.type)
  }

  const [min, max] = filters.creditRange
  list = list.filter((c) => c.credit >= min && c.credit <= max)

  switch (filters.sort) {
    case 'credit_asc':
      list.sort((a, b) => a.credit - b.credit)
      break
    case 'name_asc':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'credit_desc':
    default:
      list.sort((a, b) => b.credit - a.credit)
      break
  }

  return list
}
