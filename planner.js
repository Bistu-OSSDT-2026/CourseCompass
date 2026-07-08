import client from './client'

/**
 * 计算学分差额
 * @param {{ taken_courses: Array<{category: string, credits: number}> }} data
 */
export const calculateCredit = (data) =>
  client.post('/credit/calculate', data)

/**
 * 获取学分规则配置
 */
export const getCreditRules = () =>
  client.get('/credit-rules')
