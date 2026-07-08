import client from './client'

// 评论接口已整合到 courses.js 中
// 此文件为预留，按需导出引用

export const getComments = (courseId, params) =>
  client.get('/comments', { params: { course_id: courseId, ...params } })

export const createComment = (courseId, data) =>
  client.post('/comments', { course_id: courseId, ...data })
