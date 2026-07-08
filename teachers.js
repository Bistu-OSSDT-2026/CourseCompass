import client from './client'

/**
 * 获取教师列表
 */
export const getTeachers = (params = {}) =>
  client.get('/teachers', { params })

/**
 * 获取教师详情
 * @param {number|string} id - 教师 ID
 */
export const getTeacherDetail = (id) =>
  client.get(`/teachers/${id}`)
