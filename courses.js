import client from './client'

/**
 * 将后端课程数据转换为前端格式
 * 后端字段 → 前端字段映射:
 *   credits → credit
 *   rating → avg_rating
 *   holland_type (string "I,R") → holland_tags (array ["I","R"])
 *   teacher_name → teacher { name }
 */
function transformCourse(course) {
  if (!course) return course
  return {
    ...course,
    credit: course.credits ?? course.credit,
    avg_rating: course.rating ?? course.avg_rating,
    holland_tags: course.holland_type
      ? course.holland_type.split(',').map((t) => t.trim()).filter(Boolean)
      : course.holland_tags || [],
    teacher: course.teacher_name
      ? { name: course.teacher_name }
      : course.teacher || null,
    comment_count: course.comments ? course.comments.length : (course.comment_count || 0),
  }
}

/**
 * 获取课程列表
 */
export const getCourses = async (params = {}) => {
  const data = await client.get('/courses', { params })
  if (data?.courses) {
    data.courses = data.courses.map(transformCourse)
  }
  return data
}

/**
 * 获取课程详情
 * @param {number|string} id - 课程 ID
 */
export const getCourseDetail = async (id) => {
  const data = await client.get(`/courses/${id}`)
  return transformCourse(data)
}

/**
 * 获取课程评论列表
 */
export const getCourseComments = (courseId, params = {}) =>
  client.get('/comments', { params: { course_id: courseId, ...params } })

/**
 * 提交课程评论
 */
export const postComment = (courseId, data) =>
  client.post('/comments', { course_id: courseId, ...data })
