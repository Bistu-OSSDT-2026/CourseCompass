import client from './client'

/**
 * 提交问卷答案
 * @param {string[]} answers - 20 个答案组成的数组
 */
export const submitQuiz = (answers) =>
  client.post('/quiz/submit', { answers })

/**
 * 获取问卷题目（预案，目前问卷为前端静态数据）
 */
export const getQuestions = () =>
  client.get('/quiz/questions')
