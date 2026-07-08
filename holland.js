import { QUESTION_DIMENSIONS, ANSWER_SCORES } from './questions'

/**
 * Holland 六种人格类型定义
 */
export const HOLLAND_TYPES = {
  R: {
    code: 'R',
    label: '实用型',
    fullLabel: '实用型 (Realistic)',
    icon: '🔧',
    description:
      '你喜欢动手解决实际问题，偏好需要体力、工具或机械操作的活动。你务实、坦率、稳定，享受看得见摸得着的成果。',
    strengths: '动手能力强、注重实际、善于操作工具与设备',
    suitable: '工程、技术研发、实验操作、户外实践类课程',
  },
  I: {
    code: 'I',
    label: '研究型',
    fullLabel: '研究型 (Investigative)',
    icon: '🔬',
    description:
      '你对事物的运作原理有强烈好奇心，喜欢独立思考和解决复杂问题。你理性、严谨、善于分析，享受探索未知领域。',
    strengths: '逻辑分析能力强、善于抽象思考、好奇心旺盛',
    suitable: '理论研究、科学实验、数据分析、算法设计类课程',
  },
  A: {
    code: 'A',
    label: '艺术型',
    fullLabel: '艺术型 (Artistic)',
    icon: '🎨',
    description:
      '你富有创造力，偏好通过文字、音乐、美术等形式表达自我。你想象力丰富、情感敏锐、追求独特性与美感。',
    strengths: '创意表达出色、审美能力强、善于创新与想象',
    suitable: '设计、文学创作、视觉艺术、多媒体制作类课程',
  },
  S: {
    code: 'S',
    label: '社会型',
    fullLabel: '社会型 (Social)',
    icon: '🤝',
    description:
      '你乐于帮助他人，善于沟通与合作。你热情、友善、有同理心，享受教导、服务或支持他人的过程。',
    strengths: '沟通表达能力强、共情能力好、善于团队协作',
    suitable: '教育、心理咨询、社会工作、客户服务相关课程',
  },
  E: {
    code: 'E',
    label: '企业型',
    fullLabel: '企业型 (Enterprising)',
    icon: '💼',
    description:
      '你享受领导和说服他人，关切商业与政治议题。你自信、有抱负、精力充沛，擅长规划与组织。',
    strengths: '领导力强、善于说服和激励、具备商业头脑',
    suitable: '管理学、市场营销、创业实践、公共演讲类课程',
  },
  C: {
    code: 'C',
    label: '常规型',
    fullLabel: '常规型 (Conventional)',
    icon: '📋',
    description:
      '你做事有条理，注重细节和规范，喜欢在结构清晰的环境中完成任务。你细心、可靠、高效，善于管理数据与流程。',
    strengths: '组织规划能力好、注重细节、执行力强',
    suitable: '财务管理、行政管理、数据处理、流程优化类课程',
  },
}

/**
 * Holland 类型组合 → 推荐发展方向映射
 * 每个方向包含对应的推荐课程关键词
 */
export const DIRECTION_MAP = {
  // 实用型 + 研究型
  RI: { id: 'tech', label: '技术研发方向', description: '适合走工程师、算法研究路线，将理论与实践结合解决技术问题' },
  IR: { id: 'tech', label: '技术研发方向', description: '适合走工程师、算法研究路线，将理论与实践结合解决技术问题' },

  // 实用型 + 常规型
  RC: { id: 'engineering', label: '工程实践方向', description: '适合工程实施、质量管控、标准化作业等实践性强的岗位' },
  CR: { id: 'engineering', label: '工程实践方向', description: '适合工程实施、质量管控、标准化作业等实践性强的岗位' },

  // 实用型 + 企业型
  RE: { id: 'product', label: '产品管理方向', description: '适合将动手能力与管理能力结合，走产品研发管理路线' },
  ER: { id: 'product', label: '产品管理方向', description: '适合将动手能力与管理能力结合，走产品研发管理路线' },

  // 研究型 + 艺术型
  IA: { id: 'research', label: '学术研究方向', description: '适合深耕学术领域，将严谨研究与创新思维结合' },
  AI: { id: 'research', label: '学术研究方向', description: '适合深耕学术领域，将严谨研究与创新思维结合' },

  // 研究型 + 社会型
  IS: { id: 'education', label: '教育科研方向', description: '适合教育、科研指导、科普传播等结合教学与研究的工作' },
  SI: { id: 'education', label: '教育科研方向', description: '适合教育、科研指导、科普传播等结合教学与研究的工作' },

  // 研究型 + 常规型
  IC: { id: 'data', label: '数据分析方向', description: '适合数据分析、系统架构等需要严谨和数据敏感度的岗位' },
  CI: { id: 'data', label: '数据分析方向', description: '适合数据分析、系统架构等需要严谨和数据敏感度的岗位' },

  // 艺术型 + 社会型
  AS: { id: 'creative', label: '创意传播方向', description: '适合新媒体、内容创作、文化传播等需要创意与沟通的工作' },
  SA: { id: 'creative', label: '创意传播方向', description: '适合新媒体、内容创作、文化传播等需要创意与沟通的工作' },

  // 艺术型 + 企业型
  AE: { id: 'design', label: '创意设计方向', description: '适合UI/UX设计、品牌策划、广告创意等商业创意岗位' },
  EA: { id: 'design', label: '创意设计方向', description: '适合UI/UX设计、品牌策划、广告创意等商业创意岗位' },

  // 社会型 + 企业型
  SE: { id: 'management', label: '管理服务方向', description: '适合人力资源、项目协调、客户管理等组织管理工作' },
  ES: { id: 'management', label: '管理服务方向', description: '适合人力资源、项目协调、客户管理等组织管理工作' },

  // 社会型 + 常规型
  SC: { id: 'service', label: '运营服务方向', description: '适合行政运营、客户服务、流程管理等规范化服务工作' },
  CS: { id: 'service', label: '运营服务方向', description: '适合行政运营、客户服务、流程管理等规范化服务工作' },

  // 企业型 + 常规型
  EC: { id: 'business', label: '商业运营方向', description: '适合商业管理、企业运营、供应链管理等结构化商业活动' },
  CE: { id: 'business', label: '商业运营方向', description: '适合商业管理、企业运营、供应链管理等结构化商业活动' },

  // 实用型 + 艺术型
  RA: { id: 'maker', label: '创意实现方向', description: '适合将动手能力与艺术创意结合，走工业设计、手工创作路线' },
  AR: { id: 'maker', label: '创意实现方向', description: '适合将动手能力与艺术创意结合，走工业设计、手工创作路线' },

  // 实用型 + 社会型
  RS: { id: 'field', label: '现场服务方向', description: '适合需要动手能力与社交能力结合的现场技术服务工作' },
  SR: { id: 'field', label: '现场服务方向', description: '适合需要动手能力与社交能力结合的现场技术服务工作' },

  // 研究型 + 企业型
  IE: { id: 'techBiz', label: '科技创业方向', description: '适合将技术专长与商业能力结合的科技创业或技术管理岗位' },
  EI: { id: 'techBiz', label: '科技创业方向', description: '适合将技术专长与商业能力结合的科技创业或技术管理岗位' },

  // 艺术型 + 常规型
  AC: { id: 'mediaOp', label: '传媒运营方向', description: '适合将创意与组织能力结合的内容运营、编辑等岗位' },
  CA: { id: 'mediaOp', label: '传媒运营方向', description: '适合将创意与组织能力结合的内容运营、编辑等岗位' },
}

/**
 * 展示用方向详情（结果页推荐展示用）
 */
export const DIRECTION_DETAILS = {
  tech: {
    name: '技术研发方向',
    desc: '以技术为核心竞争力，适合选择编程、算法、系统开发等课程',
    courses: [
      { name: '数据结构', credit: 3, type: '专业必修' },
      { name: '操作系统', credit: 3, type: '专业必修' },
      { name: '计算机网络', credit: 3, type: '专业必修' },
    ],
  },
  engineering: {
    name: '工程实践方向',
    desc: '注重动手能力和工程实施，适合硬件、嵌入式、系统集成类课程',
    courses: [
      { name: '计算机组成原理', credit: 3, type: '专业必修' },
      { name: '嵌入式系统', credit: 2, type: '专业选修' },
      { name: '数字电路', credit: 3, type: '专业必修' },
    ],
  },
  product: {
    name: '产品管理方向',
    desc: '技术与管理结合，适合产品设计、项目管理类课程',
    courses: [
      { name: '软件工程', credit: 3, type: '专业必修' },
      { name: '产品设计', credit: 2, type: '专业选修' },
      { name: '项目管理', credit: 2, type: '公共选修' },
    ],
  },
  research: {
    name: '学术研究方向',
    desc: '深耕理论前沿，适合数学、理论计算机、科研方法类课程',
    courses: [
      { name: '高等数学', credit: 4, type: '公共必修' },
      { name: '算法设计与分析', credit: 3, type: '专业选修' },
      { name: '人工智能导论', credit: 2, type: '专业选修' },
    ],
  },
  education: {
    name: '教育科研方向',
    desc: '结合教学与研究，适合教育技术、科普传播等相关课程',
    courses: [
      { name: '教育心理学', credit: 2, type: '公共选修' },
      { name: '教学系统设计', credit: 2, type: '专业选修' },
      { name: '多媒体技术', credit: 2, type: '专业选修' },
    ],
  },
  data: {
    name: '数据分析方向',
    desc: '以数据为核心，适合数据库、大数据、统计分析等课程',
    courses: [
      { name: '数据库原理', credit: 3, type: '专业必修' },
      { name: '数据挖掘', credit: 2, type: '专业选修' },
      { name: '概率论与数理统计', credit: 3, type: '公共必修' },
    ],
  },
  creative: {
    name: '创意传播方向',
    desc: '创意与传播结合，适合新媒体、内容创作、数字媒体类课程',
    courses: [
      { name: '新媒体概论', credit: 2, type: '公共选修' },
      { name: '数字媒体技术', credit: 2, type: '专业选修' },
      { name: '视觉传达设计', credit: 2, type: '公共选修' },
    ],
  },
  design: {
    name: '创意设计方向',
    desc: '商业与美学结合，适合UI/UX、交互设计、品牌策划类课程',
    courses: [
      { name: '人机交互', credit: 2, type: '专业选修' },
      { name: '用户界面设计', credit: 2, type: '专业选修' },
      { name: '市场营销学', credit: 2, type: '公共选修' },
    ],
  },
  management: {
    name: '管理服务方向',
    desc: '组织与协调为核心，适合管理学、人力资源、沟通类课程',
    courses: [
      { name: '管理学原理', credit: 2, type: '公共选修' },
      { name: '组织行为学', credit: 2, type: '公共选修' },
      { name: '公共关系学', credit: 2, type: '公共选修' },
    ],
  },
  service: {
    name: '运营服务方向',
    desc: '规范化服务与运营，适合行政、客户管理、流程优化类课程',
    courses: [
      { name: '客户关系管理', credit: 2, type: '公共选修' },
      { name: '商务礼仪', credit: 1, type: '公共选修' },
      { name: '信息管理系统', credit: 2, type: '专业选修' },
    ],
  },
  business: {
    name: '商业运营方向',
    desc: '商业思维与规范流程结合，适合企业运营、供应链、财务类课程',
    courses: [
      { name: '微观经济学', credit: 2, type: '公共选修' },
      { name: '会计学基础', credit: 2, type: '公共选修' },
      { name: '电子商务', credit: 2, type: '专业选修' },
    ],
  },
  maker: {
    name: '创意实现方向',
    desc: '动手与创意结合，适合工业设计、模型制作、原型开发类课程',
    courses: [
      { name: '工程制图', credit: 2, type: '专业选修' },
      { name: '3D建模基础', credit: 2, type: '专业选修' },
      { name: '创新设计方法', credit: 2, type: '公共选修' },
    ],
  },
  field: {
    name: '现场服务方向',
    desc: '动手能力与社交结合，适合现场技术服务、技术支持类课程',
    courses: [
      { name: '计算机网络', credit: 3, type: '专业必修' },
      { name: '系统维护技术', credit: 2, type: '专业选修' },
      { name: '沟通技巧', credit: 1, type: '公共选修' },
    ],
  },
  techBiz: {
    name: '科技创业方向',
    desc: '技术+商业双轮驱动，适合创新创业、技术管理类课程',
    courses: [
      { name: '创业管理', credit: 2, type: '公共选修' },
      { name: '知识产权法', credit: 2, type: '公共选修' },
      { name: '技术经济学', credit: 2, type: '公共选修' },
    ],
  },
  mediaOp: {
    name: '传媒运营方向',
    desc: '创意表达+精细化运营，适合内容策划、编辑出版类课程',
    courses: [
      { name: '传播学概论', credit: 2, type: '公共选修' },
      { name: '编辑学', credit: 2, type: '公共选修' },
      { name: '数字出版技术', credit: 2, type: '专业选修' },
    ],
  },
}

/**
 * 根据 20 题答案计算 Holland 类型
 * @param {string[]} answers - 长度为 20 的答案数组，每项为 A/B/C/D/E
 * @returns {{ typeCode: string, typeLabel: string, directions: object[] }}
 */
export function calculateHollandType(answers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  answers.forEach((ans, i) => {
    const dim = QUESTION_DIMENSIONS[i]
    const score = ANSWER_SCORES[ans]
    if (dim && score) {
      scores[dim] += score
    }
  })

  // 按得分降序排列
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])

  // 取得分最高的两个维度
  const top1 = sorted[0][0]
  const top2 = sorted[1][0]
  const typeCode = top1 + top2

  // 查找对应的方向
  const directionInfo = DIRECTION_MAP[typeCode] || DIRECTION_MAP[top2 + top1]
  const directionDetail = directionInfo
    ? DIRECTION_DETAILS[directionInfo.id]
    : null

  const primaryType = HOLLAND_TYPES[top1]
  const secondaryType = HOLLAND_TYPES[top2]

  return {
    typeCode,
    typeLabel: `${primaryType.icon} ${primaryType.label}-${secondaryType.label}`,
    typeDescription: primaryType.description,
    primaryType: { code: top1, ...primaryType },
    secondaryType: { code: top2, ...secondaryType },
    allScores: scores,
    direction: directionInfo
      ? {
          id: directionInfo.id,
          label: directionInfo.label,
          description: directionInfo.description,
          courses: directionDetail?.courses || [],
        }
      : null,
    // 备选方向（仅用 top1 构建的方向作为参考）
    alternativeDirections: [],
  }
}

/**
 * 获取单个 Holland 维度的详细信息
 * @param {string} code - 维度代码 (R/I/A/S/E/C)
 */
export function getTypeInfo(code) {
  return HOLLAND_TYPES[code] || null
}
