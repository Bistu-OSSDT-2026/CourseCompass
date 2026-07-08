# CourseCompass 🧭

> 面向完全学分制高校新生的选课导航平台——测评兴趣、发现方向、了解老师、听听学长怎么说。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Status](https://img.shields.io/badge/status-in%20development-orange.svg)

---

## ✨ 功能一览

| 功能 | 说明 |
|------|------|
| 🧠 兴趣测评 | 20 题 Holland 量表，输出你的兴趣类型和推荐发展方向 |
| 📚 课程导览 | 按方向 / 学分 / 类型筛选全部课程，快速找到适合的课 |
| 👩‍🏫 教师信息 | 聚合官网导师简介、研究方向、开设课程 |
| 💬 选课评论 | 匿名分享上课体验，帮下一届同学少踩坑 |
| 🎯 学分规划器 | 输入已修学分，自动计算差额并推荐补修课程 |

---

## 🖼️ 截图

> _(开发中，截图待补充)_

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.10
- pip

### 克隆项目

```bash
git clone https://github.com/your-org/coursecompass.git
cd coursecompass
```

### 启动后端

```bash
cd backend
pip install -r requirements.txt
python run.py
```

访问 http://localhost:5000/api/health 确认启动成功。

### 启动前端（开发模式，前后端分离）

```bash
cd Web/Web
npm install
npm run dev
```

打开浏览器访问 http://localhost:5173

### 生产模式（后端 + 前端一体化）

```bash
cd backend

# Linux / macOS / WSL
./start.sh --prod

# Windows
start-prod.bat
```

Gunicorn 启动后，访问 http://localhost:5000 即可使用完整应用（API + 前端 SPA）。

---

## 🛠️ 技术栈

**前端**：React 18 · Vite · React Router v6 · Axios · Tailwind CSS

**后端**：Flask · SQLAlchemy · Flask-CORS · Gunicorn

**数据库**：SQLite（开发） / PostgreSQL（生产可选）

**部署**：Render（后端 + 前端一体化）

---

## 📁 项目结构

```
coursecompass/
├── Web/Web/             # React 前端
│   └── src/
│       ├── pages/       # 页面组件
│       ├── components/  # 复用 UI 组件
│       ├── api/         # 接口封装
│       └── constants/   # 问卷题目、Holland 映射表
├── backend/             # Flask 后端
│   ├── app/
│   │   ├── api/         # API 蓝图（courses, teachers, comments, quiz, credit）
│   │   ├── models/      # 数据模型（Course, Teacher, Comment, CreditRule）
│   │   ├── data/        # 种子数据 JSON
│   │   └── config.py    # 配置文件
│   ├── static/          # 前端构建产物（生产模式托管）
│   ├── course_compass.db # SQLite 数据库（119门课程 + 752位教师）
│   ├── gunicorn_config.py
│   ├── wsgi.py          # Gunicorn 入口
│   └── requirements.txt
├── database/            # 原始爬虫数据库
└── render.yaml          # Render Blueprint 部署配置
```

---

## 🚢 部署上线（Render）

### 一键部署

1. 将代码推送到 GitHub
2. 打开 [Render Dashboard](https://dashboard.render.com)
3. 点击 **New +** → **Blueprint**
4. 连接仓库 → Render 自动读取 `render.yaml` 并创建服务

### 部署架构

```
GitHub Repo → Render Blueprint
                ├── build: pip install
                └── start: gunicorn wsgi:prod_app
                              ├── /api/* → Flask API
                              └── /*     → React SPA 静态文件
```

### 环境变量（由 render.yaml 自动配置）

| 变量 | 说明 | 值 |
|------|------|-----|
| `PYTHON_VERSION` | Python 版本 | 3.11.0 |
| `SECRET_KEY` | Flask 密钥 | Render 自动生成 |
| `GUNICORN_WORKERS` | Worker 数量 | 2（免费层最优） |

### 注意事项

- **数据库**：使用 SQLite（`backend/course_compass.db`），部署时包含在仓库中。免费层文件系统是临时的，每次重新部署用户提交的评论会丢失。如需持久化存储，后续可迁移到 Render PostgreSQL。
- **健康检查**：`/api/health` 端点用于 Render 监控服务状态
- **免费层限制**：15 分钟无请求会自动休眠，下次请求需要 30-60 秒唤醒

### 手动部署（不使用 Blueprint）

在 Render Dashboard 手动创建 Web Service：
- **Environment**: Python
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && gunicorn -c gunicorn_config.py wsgi:prod_app`

---

## 🤝 参与贡献

我们欢迎任何形式的贡献！请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

有想法或发现 bug？[提一个 Issue](https://github.com/your-org/coursecompass/issues/new) 告诉我们。

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

---

## 👥 团队

大一五人小组出品 · 第一个开源项目 · Bug 还没测所以不存在 🐛
