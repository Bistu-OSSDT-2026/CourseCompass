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
cp .env.example .env          # 复制环境变量模板并填写
python scripts/import_data.py # 首次运行，导入初始数据
flask run --port=5000
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

打开浏览器访问 [http://localhost:5173](http://localhost:5173)

---

## 🛠️ 技术栈

**前端**：React 18 · Vite · React Router v6 · Axios · Tailwind CSS

**后端**：Flask · SQLAlchemy · Flask-CORS

**数据库**：SQLite（开发） / PostgreSQL（生产）

**部署**：Vercel（前端） + Render（后端）

---

## 📁 项目结构

```
coursecompass/
├── frontend/          # React 前端
│   └── src/
│       ├── pages/     # 页面组件
│       ├── components/# 复用 UI 组件
│       ├── hooks/     # 自定义 Hook
│       ├── api/       # 接口封装
│       └── constants/ # 问卷题目、Holland 映射表
├── backend/           # Flask 后端
│   ├── models/        # 数据模型
│   ├── routes/        # 路由蓝图
│   ├── services/      # 业务逻辑
│   └── data/          # 初始数据 JSON
└── docs/              # 项目文档
    ├── 01_PRD.md
    ├── 02_技术架构.md
    ├── 03_结构规范.md
    └── 04_分工协作.md
```

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
