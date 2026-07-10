# GitHub Issues 清单

> 把这些 Issue 逐条创建到 GitHub 仓库中。创建时按「标签」打上对应 Label，按「负责人」Assign 给成员。

---

## Labels 说明（先在仓库建好这几个 Label）

| Label | 颜色 | 含义 |
|-------|------|------|
| `feature` | #0075ca | 新功能 |
| `bug` | #d73a4a | Bug |
| `data` | #e4e669 | 数据相关 |
| `docs` | #cfd3d7 | 文档相关 |
| `frontend` | #7057ff | 前端任务 |
| `backend` | #008672 | 后端任务 |
| `priority:high` | #b60205 | 高优先级 |
| `good first issue` | #7fc97f | 适合新手 |

---

## MVP Issues（Day 1–7 必须完成）

### 🧱 基础搭建

**#1 搭建前端脚手架**
- 标签：`frontend`
- 负责人：B
- 描述：用 Vite 创建 React 项目，配置 React Router v6 路由（首页/问卷/课程/教师/规划器），配置 Tailwind CSS，配置 Axios baseURL，配置 Vite 代理 `/api` → `localhost:5000`。
- 完成标准：`npm run dev` 能跑，各路由页面能跳转。

---

**#2 搭建后端骨架**
- 标签：`backend`
- 负责人：C
- 描述：初始化 Flask 项目，配置 SQLAlchemy + Flask-CORS，按数据结构文档建好所有数据库表（Course / Teacher / Comment / CreditRule），写好 `.env.example`。
- 完成标准：`flask run` 能跑，数据库表建好，`/api/v1/health` 返回 200。

---

**#3 初始数据导入**
- 标签：`data` `priority:high`
- 负责人：D
- 描述：整理本专业课程列表（至少 20 条），整理任课教师信息（至少 10 条），整理完全学分制毕业学分要求，写入对应 JSON 文件，运行 `import_data.py` 导入数据库。
- 完成标准：`GET /api/v1/courses` 能返回真实数据。

---

### 🧠 功能模块

**#4 Holland 问卷页面**
- 标签：`frontend` `feature` `priority:high`
- 负责人：B
- 描述：实现 `Quiz.jsx` 页面。包含：进度条（当前题/总题数）、题目展示、4个选项、「下一题」和「上一题」按钮、最后一题显示「提交」按钮、提交时调用 `POST /api/v1/quiz/submit`、加载中状态处理。题目数据来自 `constants/questions.js`，不走接口。
- 完成标准：能完整走完 20 题并提交，支持返回上一题。

---

**#5 问卷后端接口**
- 标签：`backend` `feature` `priority:high`
- 负责人：C
- 描述：实现 `POST /api/v1/quiz/submit`。接收 20 个答案 → 调用 `holland_scorer.py` 计算类型 → 调用 `recommender.py` 查询推荐方向和课程 → 返回结果。参考接口规范文档。
- 完成标准：传入 20 个答案，返回 holland_type + 推荐方向 + 每个方向的推荐课程列表。

---

**#6 测评结果页**
- 标签：`frontend` `feature`
- 负责人：B
- 描述：实现 `QuizResult.jsx`。展示 Holland 类型名称和描述卡片，展示 1–3 个推荐方向（每个方向含名称、描述、推荐课程列表），点击方向跳转到课程列表（带 `direction` 过滤参数）。
- 完成标准：结果页展示完整，点击方向能跳转到对应过滤的课程列表。

---

**#7 课程列表页**
- 标签：`frontend` `feature` `priority:high`
- 负责人：B
- 描述：实现 `Courses.jsx`。调用 `GET /api/v1/courses`，展示课程卡片列表，支持：关键词搜索、按方向/类型/学分区间筛选、排序切换、骨架屏加载、空结果提示、分页或无限滚动。
- 完成标准：能正常展示课程列表，筛选和搜索功能正常工作。

---

**#8 课程列表后端接口**
- 标签：`backend` `feature` `priority:high`
- 负责人：C
- 描述：实现 `GET /api/v1/courses`（支持 keyword / direction / type / credit_min / credit_max / sort / page / page_size）和 `GET /api/v1/courses/:id`。参考接口规范文档中的字段定义。
- 完成标准：各参数过滤正常，返回格式符合规范。

---

**#9 课程详情页**
- 标签：`frontend` `feature`
- 负责人：B
- 描述：实现 `CourseDetail.jsx`。展示课程完整信息（名称/学分/类型/院系/简介/Holland标签），展示任课教师简要信息（可点击跳转），嵌入评论区组件（`CommentList` + `CommentForm`）。
- 完成标准：课程详情展示完整，评论区正常显示和提交。

---

**#10 教师列表页**
- 标签：`frontend` `feature`
- 负责人：B
- 描述：实现 `Teachers.jsx`。调用 `GET /api/v1/teachers`，展示教师卡片，支持姓名搜索和院系筛选。
- 完成标准：教师列表正常展示，搜索功能可用。

---

**#11 教师接口**
- 标签：`backend` `feature`
- 负责人：C
- 描述：实现 `GET /api/v1/teachers`（支持 keyword / department / page）和 `GET /api/v1/teachers/:id`（含开设课程列表）。
- 完成标准：返回格式符合规范，详情页包含 courses 数组。

---

**#12 评论提交接口**
- 标签：`backend` `feature`
- 负责人：C
- 描述：实现 `GET /api/v1/courses/:id/comments` 和 `POST /api/v1/courses/:id/comments`。提交后 `is_visible=false`，需要审核。加入简单敏感词过滤（调用 `content_filter.py`）。写一个命令行审核脚本 `scripts/review_comments.py`。
- 完成标准：评论可提交，过滤明显违规内容，已审核评论正常展示。

---

**#13 学分规划器**
- 标签：`frontend` `backend` `feature`
- 负责人：A（设计）+ B（前端）+ C（接口）
- 描述：实现 `Planner.jsx`。用户输入年级和各类已修学分，调用 `POST /api/v1/planner/calculate`，展示各类别差额和推荐补修课程。
- 完成标准：输入数据后实时展示差额，推荐课程可点击跳转详情。

---

### 📦 上线准备

**#14 移动端适配**
- 标签：`frontend`
- 负责人：B
- 描述：确保所有页面在 375px（iPhone SE）到 768px 宽度下正常显示，导航改为底部 Tab 栏。
- 完成标准：手机浏览器打开无明显布局错乱。

**#15 部署上线**
- 标签：`backend`
- 负责人：C
- 描述：前端部署到 Vercel，后端部署到 Render，配置 PostgreSQL 生产数据库，配置生产环境变量，联调线上环境。
- 完成标准：线上地址可以正常访问全部功能。

**#16 完善 README**
- 标签：`docs`
- 负责人：E
- 描述：补充线上访问地址、功能截图（至少首页/问卷结果页/课程列表页各一张）、演示 GIF（可选）。
- 完成标准：README 图文并茂，新访客能在 2 分钟内了解项目并本地跑起来。

---

## 后续迭代 Issues（上线后慢慢做）

**#17 补充课程数据**
- 标签：`data` `good first issue`
- 描述：持续补充课程信息，目标覆盖全专业所有课程，添加时保持 JSON 格式一致。

**#18 补充教师数据**
- 标签：`data` `good first issue`
- 描述：补充更多教师信息，尤其是研究方向描述和开设课程关联。

**#19 评论后台审核 Web 界面**
- 标签：`feature` `backend` `frontend`
- 描述：目前用命令行脚本审核评论，后续可做一个简单的密码保护管理页面。

**#20 支持其他学校**
- 标签：`feature`
- 描述：把学校相关配置（课程数据、学分规则）抽成可配置文件，方便其他学校 fork 后快速替换数据使用。
