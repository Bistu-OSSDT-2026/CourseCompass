import { useState, useCallback, useEffect } from 'react'
import { getTeachers } from '../api/teachers'

export function useTeachers(initialParams = {}) {
  const [params, setParams] = useState({
    keyword: '',
    department: null,
    page: 1,
    pageSize: 20,
    ...initialParams,
  })
  const [teachers, setTeachers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = { page: params.page, page_size: params.pageSize }
      if (params.keyword) query.keyword = params.keyword
      if (params.department) query.department = params.department

      const data = await getTeachers(query)
      setTeachers(data?.teachers || [])
      setTotal(data?.pagination?.total || data?.teachers?.length || 0)
    } catch (e) {
      if (e.message?.includes('网络') || e.message?.includes('服务器')) {
        setTeachers(getMockTeachers(params))
        setTotal(getMockTeachers(params).length)
      } else {
        setError(e.message || '加载教师列表失败')
      }
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const updateParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))
  }, [])

  const setPage = useCallback((page) => updateParam('page', page), [updateParam])

  const resetParams = useCallback(() => {
    setParams({
      keyword: '',
      department: null,
      page: 1,
      pageSize: 20,
    })
  }, [])

  return {
    params,
    teachers,
    total,
    loading,
    error,
    updateParam,
    setPage,
    resetParams,
    refetch: fetchTeachers,
  }
}

/* ====== 模拟数据 ====== */

const MOCK_TEACHERS = [
  { id: 1, name: '张明', title: '副教授', department: '计算机学院', research: '分布式系统、云计算', course_count: 3 },
  { id: 2, name: '李芳', title: '教授', department: '计算机学院', research: '软件工程、形式化方法', course_count: 2 },
  { id: 3, name: '王强', title: '教授', department: '计算机学院', research: '嵌入式系统、物联网', course_count: 2 },
  { id: 4, name: '赵雪', title: '副教授', department: '计算机学院', research: '数据库、数据挖掘', course_count: 2 },
  { id: 5, name: '陈博', title: '教授', department: '数学学院', research: '概率统计、随机过程', course_count: 2 },
  { id: 6, name: '刘洋', title: '教授', department: '计算机学院', research: '机器学习、自然语言处理', course_count: 1 },
  { id: 7, name: '周敏', title: '讲师', department: '计算机学院', research: '计算机网络、网络安全', course_count: 1 },
  { id: 8, name: '孙悦', title: '副教授', department: '管理学院', research: '信息管理、电子商务', course_count: 2 },
]

function getMockTeachers(params) {
  let list = [...MOCK_TEACHERS]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.research.toLowerCase().includes(kw)
    )
  }

  if (params.department) {
    list = list.filter((t) => t.department === params.department)
  }

  return list
}
