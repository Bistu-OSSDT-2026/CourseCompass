/**
 * 问卷题目（静态数据，共 20 题）
 * 每题对应一个 Holland 维度，5 级李克特量表
 *
 * 选项值：A=非常不符合(1分) B=比较不符合(2分) C=一般(3分) D=比较符合(4分) E=非常符合(5分)
 */

const QUESTION_DIMENSIONS = [
  'R', 'I', 'A', 'S', 'E', 'C',
  'R', 'I', 'A', 'S', 'E', 'C',
  'R', 'I', 'A', 'S', 'E', 'C',
  'R', 'I',
]

export const ANSWER_SCORES = { A: 1, B: 2, C: 3, D: 4, E: 5 }

export const QUESTIONS = [
  {
    id: 1,
    text: '我喜欢动手修理家电或组装家具',
    dimension: 'R',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 2,
    text: '我乐于钻研数学或科学难题',
    dimension: 'I',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 3,
    text: '我经常有创意性的想法，喜欢写作或画画',
    dimension: 'A',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 4,
    text: '我享受帮助他人解决困难的过程',
    dimension: 'S',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 5,
    text: '我习惯在团队中担任主导角色，喜欢安排任务',
    dimension: 'E',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 6,
    text: '我做事细致，喜欢按流程和规范完成任务',
    dimension: 'C',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 7,
    text: '我更愿意动手实践而非阅读理论书籍',
    dimension: 'R',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 8,
    text: '我对事物的运作原理有强烈的好奇心',
    dimension: 'I',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 9,
    text: '我欣赏音乐、戏剧或文学等艺术形式',
    dimension: 'A',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 10,
    text: '我乐于教导或辅导学习上有困难的人',
    dimension: 'S',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 11,
    text: '我享受说服他人接受我的观点',
    dimension: 'E',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 12,
    text: '我擅长整理文件、归档或管理数据',
    dimension: 'C',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 13,
    text: '我喜欢使用工具和机械来完成工作',
    dimension: 'R',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 14,
    text: '我喜欢独立进行科学实验或研究项目',
    dimension: 'I',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 15,
    text: '我经常做白日梦或构想新的创意方案',
    dimension: 'A',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 16,
    text: '我乐于倾听朋友倾诉并给予支持',
    dimension: 'S',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 17,
    text: '我喜欢制定计划并激励他人一起执行',
    dimension: 'E',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 18,
    text: '我在工作中很看重效率和准确性',
    dimension: 'C',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 19,
    text: '我享受户外体力劳动或手工制作',
    dimension: 'R',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
  {
    id: 20,
    text: '我喜欢阅读科学类书籍或观看科普纪录片',
    dimension: 'I',
    options: [
      { value: 'A', label: '非常不符合' },
      { value: 'B', label: '比较不符合' },
      { value: 'C', label: '一般' },
      { value: 'D', label: '比较符合' },
      { value: 'E', label: '非常符合' },
    ],
  },
]

export { QUESTION_DIMENSIONS }

export default QUESTIONS
