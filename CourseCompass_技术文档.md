# CouseCompass 技术文档

> 版本 v0.1 · 五人小组 · 大一开源项目

---

## 目录

1. [PRD 产品需求](#1-prd-产品需求)
2. [交互设计](#2-交互设计)
3. [技术架构](#3-技术架构)
4. [数据结构](#4-数据结构)
5. [接口规范](#5-接口规范)

---

## 1. PRD 产品需求

### 1.1 问题陈述

实行完全学分制后，学生需要自行规划修课路径，但面临三个核心障碍：

- **信息分散**：课程信息在教务系统、专业培养方案、老师个人主页三处割裂，没有统一入口
- **决策盲区**：新生不清楚自己适合哪个发展方向，只能凭感觉或跟风选课
- **经验断层**：选过课的学长学姐的评价和建议无处沉淀，每届重复踩坑

### 1.2 目标用户

| 用户群 | 场景 | 核心诉求 |
|--------|------|----------|
| 大一新生 | 入学后首次选课 | "我该选什么方向，从哪里开始" |
| 在校生（大二及以上） | 每学期选课前 | "这门课值不值得选，这个老师怎么样" |
| 有经验的学长学姐 | 分享选课经验 | "把我踩的坑告诉后来人" |

**核心用户**：大一新生，0 基础，对学分制规则完全不熟悉。

### 1.3 功能边界

**做（MVP 范围内）**

- Holland 兴趣测评 → 输出发展方向推荐 + 对应课程列表
- 课程导览：按方向/学分/类型筛选，关键词搜索
- 教师信息聚合页：姓名、职称、研究方向、开设课程
- 课程匿名评论：难度、给分风格、建议
- 学分规划器：输入已修学分 → 显示差额 + 推荐补足课程

**不做（明确排除）**

- 自动抢课 / 模拟选课操作
- 与教务系统实时数据对接
- 用户社交关系（关注 / 私信）
- 神经网络 / LLM 个性化推荐（规则映射替代）
- 移动端原生 App（网页响应式即可）

### 1.4 成功标准

| 指标 | 目标值 | 说明 |
|------|--------|------|
| MVP 完成率 | 5 个核心功能全部可用 | 7 天内跑通 |
| 问卷完成率 | 用户启动后 > 80% 完成 | 题量控制在 20 题内 |
| 课程数据覆盖 | 本专业全部课程录入 | 手动整理兜底 |
| 评论条数（内测） | 上线首周 > 30 条 | 招募同学试用 |
| GitHub Stars | 上线后 1 个月 > 20 | 推广到校内论坛 |

---

## 2. 交互设计

### 2.1 页面地图

```
首页 (/)
├── 兴趣测评 (/quiz)
│   └── 结果页 (/quiz/result)
├── 课程导览 (/courses)
│   └── 课程详情 (/courses/:id)
│       └── 评论区（嵌入详情页）
├── 教师列表 (/teachers)
│   └── 教师详情 (/teachers/:id)
└── 学分规划器 (/planner)
```

### 2.2 主流程

#### 流程 A：新生首次使用（核心路径）

```
进入首页
  └→ 点击「开始测评」
       └→ 兴趣问卷（20题，进度条显示，支持上一题）
            └→ 提交 → 后端计算 Holland 类型
                 └→ 结果页：展示类型描述 + 推荐发展方向（1-3个）
                      └→ 点击某方向 → 跳转课程列表（已按该方向过滤）
                           └→ 点击课程 → 课程详情 + 评论区
```

#### 流程 B：老生查老师信息

```
进入教师列表
  └→ 搜索姓名 / 按院系筛选
       └→ 点击教师卡片
            └→ 教师详情：基本信息 + 开设课程列表
                 └→ 点击课程 → 跳转课程详情
```

#### 流程 C：发表评论

```
进入课程详情页
  └→ 滚动到评论区
       └→ 填写：昵称（可匿名）+ 星级 + 文字评价
            └→ 提交 → 实时展示（无需刷新）
```

#### 流程 D：学分规划

```
进入学分规划器
  └→ 输入：年级 + 已修各类学分
       └→ 实时计算差额（按完全学分制毕业要求）
            └→ 展示：各类别缺口 + 推荐可选课程
```

### 2.3 关键页面状态

#### 问卷页 `/quiz`

| 状态 | 触发条件 | 展示内容 |
|------|----------|----------|
| 初始 | 进入页面 | 欢迎语 + 「开始」按钮 |
| 答题中 | 点击开始 | 题目 + 4个选项 + 进度条 + 上一题按钮 |
| 提交中 | 点击提交 | Loading spinner（调用后端计算） |
| 结果 | 接口返回 | Holland 类型卡片 + 方向推荐列表 |
| 出错 | 接口失败 | 错误提示 + 重试按钮 |

#### 课程列表页 `/courses`

| 状态 | 展示 |
|------|------|
| 默认 | 全部课程，按学分降序 |
| 筛选中 | 高亮已选筛选项，结果实时刷新 |
| 搜索 | 关键词匹配课程名/教师名，结果高亮匹配词 |
| 空结果 | 「没有找到相关课程」+ 清空筛选按钮 |
| 加载中 | 骨架屏（Skeleton） |

#### 评论区

| 状态 | 展示 |
|------|------|
| 未提交 | 输入框 + 星级选择 + 提交按钮 |
| 提交中 | 按钮 disabled + Loading |
| 提交成功 | 新评论出现在列表顶部，表单重置 |
| 提交失败 | 红色错误提示，内容保留不丢失 |
| 无评论 | 「还没有人评价，来做第一个」 |

### 2.4 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| Mobile | < 768px | 单列，底部 Tab 导航 |
| Tablet | 768-1024px | 双列卡片，侧边导航收起 |
| Desktop | > 1024px | 三列卡片，侧边导航展开 |

---

## 3. 技术架构

### 3.1 整体架构

```
┌─────────────────────────────────────────────┐
│                  浏览器                       │
│   React SPA (Vite + React Router + Axios)   │
└──────────────────┬──────────────────────────┘
                   │ HTTP / JSON
┌──────────────────▼──────────────────────────┐
│              Flask 后端                       │
│   路由层 → 业务逻辑层 → 数据访问层(SQLAlchemy)│
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           SQLite（开发）                      │
│        PostgreSQL（生产/部署）                │
└─────────────────────────────────────────────┘
```

### 3.2 前端模块划分

```
src/
├── pages/                  # 页面组件（对应路由）
│   ├── Home.jsx
│   ├── Quiz.jsx
│   ├── QuizResult.jsx
│   ├── Courses.jsx
│   ├── CourseDetail.jsx
│   ├── Teachers.jsx
│   ├── TeacherDetail.jsx
│   └── Planner.jsx
├── components/             # 可复用 UI 组件
│   ├── Navbar.jsx
│   ├── CourseCard.jsx
│   ├── TeacherCard.jsx
│   ├── CommentList.jsx
│   ├── CommentForm.jsx
│   ├── StarRating.jsx
│   ├── FilterBar.jsx
│   └── Skeleton.jsx
├── hooks/                  # 自定义 Hook
│   ├── useCourses.js       # 课程列表数据获取 + 筛选状态
│   ├── useTeachers.js
│   └── useQuiz.js          # 问卷状态机（当前题/答案/进度）
├── api/                    # 接口封装层（统一 baseURL + 错误处理）
│   ├── client.js           # Axios 实例
│   ├── quiz.js
│   ├── courses.js
│   ├── teachers.js
│   ├── comments.js
│   └── planner.js
├── constants/
│   ├── questions.js        # 问卷题目（静态数据，不走接口）
│   └── holland.js          # 六种类型描述 + 方向映射表
└── App.jsx                 # 路由配置
```

### 3.3 后端模块划分

```
backend/
├── app.py                  # Flask 入口，注册蓝图
├── config.py               # 环境配置（dev/prod）
├── models/                 # SQLAlchemy 数据模型
│   ├── course.py
│   ├── teacher.py
│   ├── comment.py
│   └── credit_rule.py
├── routes/                 # 路由蓝图（对应接口分组）
│   ├── quiz.py
│   ├── courses.py
│   ├── teachers.py
│   ├── comments.py
│   └── planner.py
├── services/               # 业务逻辑（与路由解耦）
│   ├── holland_scorer.py   # Holland 计分 + 类型判断
│   ├── recommender.py      # 规则映射：类型 → 方向 → 课程
│   ├── content_filter.py   # 评论敏感词过滤
│   └── planner_engine.py   # 学分差额计算
├── data/
│   ├── seed_courses.json   # 初始课程数据
│   ├── seed_teachers.json  # 初始教师数据
│   └── credit_rules.json   # 完全学分制毕业要求配置
└── scripts/
    └── import_data.py      # 一次性数据导入脚本
```

### 3.4 关键依赖

**前端**

| 依赖 | 用途 |
|------|------|
| react + react-dom | UI 框架 |
| react-router-dom v6 | 客户端路由 |
| axios | HTTP 请求 |
| tailwindcss | 样式（无需手写 CSS） |
| lucide-react | 图标库 |

**后端**

| 依赖 | 用途 |
|------|------|
| flask | Web 框架 |
| flask-sqlalchemy | ORM |
| flask-cors | 跨域处理（前后端分离必须） |
| python-dotenv | 环境变量管理 |

### 3.5 本地运行方式

```bash
# 后端
cd backend
pip install -r requirements.txt
python scripts/import_data.py   # 首次运行导入数据
flask run --port=5000

# 前端（另开终端）
cd frontend
npm install
npm run dev                     # 启动 Vite，默认 http://localhost:5173
```

**前端代理配置**（`vite.config.js`）：
```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

### 3.6 部署方案

| 层 | 平台 | 说明 |
|----|------|------|
| 前端 | Vercel | 连接 GitHub 仓库自动部署，免费 |
| 后端 | Render | 免费套餐，冷启动约 30 秒可接受 |
| 数据库 | Render PostgreSQL | 免费 90 天，之后迁移 Supabase |

---

## 4. 数据结构

### 4.1 核心实体

#### Course（课程）

```python
class Course(db.Model):
    id          = Column(Integer, primary_key=True)
    name        = Column(String(100), nullable=False)   # 课程名称
    code        = Column(String(20), unique=True)        # 课程代码，如 CS101
    credit      = Column(Float, nullable=False)          # 学分，允许 0.5
    type        = Column(String(20))                     # 必修 / 专业选修 / 公共选修
    department  = Column(String(50))                     # 开课院系
    grade       = Column(String(20))                     # 适合年级，如 "大一,大二"
    description = Column(Text)                           # 课程简介
    holland_tags= Column(String(100))                    # Holland 类型标签，逗号分隔
    direction   = Column(String(50))                     # 推荐方向，如 "技术/管理/研究"
    teacher_id  = Column(Integer, ForeignKey('teacher.id'))
    created_at  = Column(DateTime, default=datetime.utcnow)

    # 关系
    teacher     = relationship('Teacher', back_populates='courses')
    comments    = relationship('Comment', back_populates='course')
```

#### Teacher（教师）

```python
class Teacher(db.Model):
    id           = Column(Integer, primary_key=True)
    name         = Column(String(50), nullable=False)
    title        = Column(String(30))        # 教授 / 副教授 / 讲师
    department   = Column(String(50))
    research     = Column(Text)              # 研究方向（可能多行）
    email        = Column(String(100))       # 公开邮箱，选填
    profile_url  = Column(String(200))       # 官网主页链接
    avatar_url   = Column(String(200))       # 头像，默认用姓名首字母占位
    created_at   = Column(DateTime, default=datetime.utcnow)

    courses      = relationship('Course', back_populates='teacher')
```

#### Comment（评论）

```python
class Comment(db.Model):
    id          = Column(Integer, primary_key=True)
    course_id   = Column(Integer, ForeignKey('course.id'), nullable=False)
    nickname    = Column(String(30), default='匿名同学')
    content     = Column(Text, nullable=False)
    rating      = Column(Integer)            # 1-5 星
    difficulty  = Column(Integer)            # 1-5（1=极难 5=很轻松）
    grading     = Column(String(20))         # 给分风格：宽松/正常/严格
    semester    = Column(String(20))         # 选课学期，如 "2024-2025秋"
    is_visible  = Column(Boolean, default=True)   # 审核通过后可见
    created_at  = Column(DateTime, default=datetime.utcnow)

    course      = relationship('Course', back_populates='comments')
```

#### CreditRule（学分规则）

```python
class CreditRule(db.Model):
    id           = Column(Integer, primary_key=True)
    category     = Column(String(50))        # 类别：必修/专业选修/公共选修/实践
    min_credit   = Column(Float)             # 该类别最低学分要求
    description  = Column(String(200))       # 规则说明
    apply_to     = Column(String(20))        # 适用年级/专业
```

### 4.2 前端本地状态

**问卷状态（`useQuiz` Hook）**

```js
{
  currentIndex: 0,          // 当前题目索引 (0-19)
  answers: [],              // 长度 20 的数组，每项为选项值 A/B/C/D 或 null
  isSubmitting: false,
  result: null              // { type: 'R', label: '实用型', directions: [...], courses: [...] }
}
```

**课程筛选状态（`useCourses` Hook）**

```js
{
  keyword: '',
  direction: null,          // 选中的推荐方向
  type: null,               // 必修/选修
  creditRange: [0, 6],      // 学分区间
  sort: 'credit_desc',
  page: 1
}
```

**学分规划器状态（本地，不持久化）**

```js
{
  grade: '',                // 年级
  completed: {
    required: 0,
    majorElective: 0,
    generalElective: 0,
    practice: 0
  }
  // 差额由 planner_engine 实时计算，不存储
}
```

### 4.3 存储策略

| 数据 | 存储位置 | 说明 |
|------|----------|------|
| 课程/教师数据 | 数据库 | 管理员手动维护，JSON 导入 |
| 评论 | 数据库 | 用户提交后审核再显示 |
| 学分规则 | `credit_rules.json` + 数据库 | 配置文件优先，便于修改不重新部署 |
| 问卷题目 | 前端 `constants/questions.js` | 静态数据，不走接口，减少请求 |
| Holland 映射表 | 前端 `constants/holland.js` | 纯规则，前端计算，不送后端 |
| 用户会话 | 浏览器 `sessionStorage` | 临时保存昵称，关闭 Tab 即清除，无需注册 |

---

## 5. 接口规范

### 5.1 通用约定

- **Base URL**：`/api/v1`
- **数据格式**：全部 JSON，`Content-Type: application/json`
- **成功响应**：

```json
{
  "code": 200,
  "data": { ... },
  "message": "success"
}
```

- **错误响应**：

```json
{
  "code": 400,
  "data": null,
  "message": "具体错误说明"
}
```

- **常见 HTTP 状态码**：200 成功 / 400 参数错误 / 404 资源不存在 / 500 服务器错误

---

### 5.2 问卷接口

#### `POST /api/v1/quiz/submit`

提交问卷答案，返回 Holland 类型和推荐结果。

**请求**

```json
{
  "answers": ["A", "B", "A", "C", "D", "..."]  // 长度必须为 20
}
```

**响应**

```json
{
  "code": 200,
  "data": {
    "holland_type": "RI",
    "type_label": "实用-研究型",
    "type_description": "你喜欢动手解决实际问题，同时对探索新知识有浓厚兴趣...",
    "directions": [
      {
        "id": "tech",
        "label": "技术研发方向",
        "description": "适合走工程师、算法研究路线",
        "courses": [
          { "id": 1, "name": "数据结构", "credit": 3 },
          { "id": 2, "name": "操作系统", "credit": 3 }
        ]
      }
    ]
  }
}
```

**前端调用（`api/quiz.js`）**

```js
export const submitQuiz = (answers) =>
  client.post('/quiz/submit', { answers })
```

---

### 5.3 课程接口

#### `GET /api/v1/courses`

获取课程列表，支持筛选和分页。

**请求参数（Query String）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索词，匹配课程名/教师名 |
| direction | string | 否 | 推荐方向 id |
| type | string | 否 | 必修 / 专业选修 / 公共选修 |
| credit_min | float | 否 | 最低学分 |
| credit_max | float | 否 | 最高学分 |
| sort | string | 否 | credit_desc / credit_asc / name_asc，默认 credit_desc |
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页条数，默认 20，最大 50 |

**响应**

```json
{
  "code": 200,
  "data": {
    "total": 86,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": 1,
        "name": "数据结构",
        "code": "CS201",
        "credit": 3.0,
        "type": "专业必修",
        "department": "计算机学院",
        "grade": "大二",
        "direction": "技术研发",
        "avg_rating": 4.2,
        "comment_count": 15,
        "teacher": {
          "id": 5,
          "name": "张明",
          "title": "副教授"
        }
      }
    ]
  }
}
```

#### `GET /api/v1/courses/:id`

获取单门课程详情。

**响应**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "数据结构",
    "code": "CS201",
    "credit": 3.0,
    "type": "专业必修",
    "department": "计算机学院",
    "grade": "大二",
    "description": "本课程介绍基本数据结构与算法...",
    "holland_tags": ["R", "I"],
    "direction": "技术研发",
    "avg_rating": 4.2,
    "comment_count": 15,
    "difficulty_avg": 3.8,
    "teacher": {
      "id": 5,
      "name": "张明",
      "title": "副教授",
      "department": "计算机学院"
    }
  }
}
```

---

### 5.4 教师接口

#### `GET /api/v1/teachers`

**请求参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| keyword | string | 搜索姓名/研究方向 |
| department | string | 按院系筛选 |
| page | int | 页码 |

**响应**（items 结构）

```json
{
  "id": 5,
  "name": "张明",
  "title": "副教授",
  "department": "计算机学院",
  "research": "机器学习、自然语言处理",
  "course_count": 2
}
```

#### `GET /api/v1/teachers/:id`

额外返回 `courses` 数组（该教师开设的所有课程简要信息）。

---

### 5.5 评论接口

#### `GET /api/v1/courses/:id/comments`

**请求参数**

| 参数 | 说明 |
|------|------|
| sort | latest（默认） / highest / lowest |
| page | 页码，每页 10 条 |

**响应**（items 结构）

```json
{
  "id": 42,
  "nickname": "匿名同学",
  "content": "老师讲课很清楚，作业适量，期末给分正常",
  "rating": 4,
  "difficulty": 3,
  "grading": "正常",
  "semester": "2024-2025秋",
  "created_at": "2025-01-15T10:23:00Z"
}
```

#### `POST /api/v1/courses/:id/comments`

**请求**

```json
{
  "nickname": "匿名同学",    // 选填，默认「匿名同学」
  "content": "...",          // 必填，10-500 字
  "rating": 4,               // 必填，1-5
  "difficulty": 3,           // 选填，1-5
  "grading": "正常",         // 选填
  "semester": "2024-2025秋"  // 选填
}
```

**响应**：返回创建成功的评论对象（`is_visible` 默认 `false`，审核后可见）

> **注意**：评论提交后进入待审核状态，管理员通过后台脚本审核（MVP 阶段用命令行工具，不做 Web 管理界面）。

---

### 5.6 学分规划接口

#### `POST /api/v1/planner/calculate`

**请求**

```json
{
  "grade": "大一",
  "completed": {
    "required": 12,
    "major_elective": 4,
    "general_elective": 2,
    "practice": 0
  }
}
```

**响应**

```json
{
  "code": 200,
  "data": {
    "summary": {
      "required":         { "completed": 12, "required": 40, "gap": 28 },
      "major_elective":   { "completed": 4,  "required": 30, "gap": 26 },
      "general_elective": { "completed": 2,  "required": 10, "gap": 8  },
      "practice":         { "completed": 0,  "required": 8,  "gap": 8  }
    },
    "total_gap": 70,
    "recommendations": [
      {
        "category": "专业必修",
        "gap": 28,
        "suggested_courses": [
          { "id": 1, "name": "数据结构", "credit": 3 },
          { "id": 3, "name": "计算机组成原理", "credit": 3 }
        ]
      }
    ]
  }
}
```

---

### 5.7 前端内部函数契约

以下为纯前端模块间的函数契约（不涉及网络请求）：

#### `calculateHollandType(answers: string[]) → string`

输入 20 个答案（每题 A/B/C/D 对应不同 Holland 维度得分），输出得分最高的两个维度代码，如 `"RI"`。

```js
// constants/holland.js
export const SCORE_MAP = {
  /* 每道题各选项对应的维度和分值，共20题 */
  0: { A: 'R', B: 'I', C: 'A', D: 'S' },
  // ...
}

export function calculateHollandType(answers) {
  const scores = { R:0, I:0, A:0, S:0, E:0, C:0 }
  answers.forEach((ans, i) => {
    const dim = SCORE_MAP[i]?.[ans]
    if (dim) scores[dim]++
  })
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k)
    .join('')
}
```

#### `calcCreditGap(completed, rules) → gaps`

纯函数，输入已修学分对象和规则配置，输出各类别差额，在 `Planner.jsx` 内直接调用，不走接口（规则 JSON 随前端打包）。

```js
export function calcCreditGap(completed, rules) {
  return Object.fromEntries(
    rules.map(({ category, min_credit }) => [
      category,
      Math.max(0, min_credit - (completed[category] ?? 0))
    ])
  )
}
```

---

## 附录：项目约定

### Git 分支策略

```
main          ← 只放稳定可运行代码
dev           ← 日常开发合并目标
feature/xxx   ← 每个人的功能分支，如 feature/quiz-page
```

提 PR 前自测通过 → 发 PR 到 dev → 至少一人 Review → 合并。

### Commit 格式

```
feat: 新增问卷页面
fix: 修复评论提交后不刷新的bug
docs: 更新 README 安装步骤
style: 统一按钮圆角样式
```

### 环境变量

```bash
# backend/.env
FLASK_ENV=development
DATABASE_URL=sqlite:///academap.db
SECRET_KEY=your-secret-key

# frontend/.env.local
VITE_API_BASE=http://localhost:5000
```

---

*文档维护：有修改随时更新此文件，推送到 `docs/` 目录，不要只在本地改。*
