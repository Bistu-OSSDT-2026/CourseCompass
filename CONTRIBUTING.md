# 贡献指南 · CONTRIBUTING

感谢你对 CourseCompass 感兴趣！这是我们的第一个开源项目，非常欢迎来自任何人的贡献，不管是修 typo、补数据、还是加新功能。

---

## 开始之前

1. 先看一下 [Issues](https://github.com/your-org/coursecompass/issues)，确认你想做的事还没有人在做
2. 如果是比较大的改动，建议先开一个 Issue 讨论方案，避免白做工
3. Fork 仓库，在你自己的 fork 上开发，完成后提 PR

---

## 本地开发环境搭建

参考 [README.md](./README.md) 的「快速开始」部分，5 分钟内可以跑起来。

---

## 分支命名规范

```
feature/简短描述        # 新功能，如 feature/teacher-search
fix/简短描述            # 修复 bug，如 fix/comment-submit
docs/简短描述           # 文档相关，如 docs/update-readme
data/简短描述           # 数据相关，如 data/add-courses-batch2
```

---

## Commit 格式

每条 commit 用一个前缀说明类型：

```
feat:  新增某个功能
fix:   修复某个 bug
docs:  更新文档
style: 样式调整（不影响功能）
data:  新增或修正数据
test:  添加测试
```

示例：

```
feat: 新增课程列表按学分筛选功能
fix: 修复问卷进度条在最后一题不更新的 bug
docs: 补充 API /courses 接口的返回字段说明
```

---

## 提 PR 的步骤

1. 从 `dev` 分支创建你的功能分支
2. 写代码，本地测试通过
3. 提 PR 到 `dev`（不是 `main`）
4. PR 描述里写清楚：做了什么 / 怎么测试的 / 有没有需要注意的地方
5. 等待至少 1 名成员 Review，有意见按意见改，没意见合并

---

## 代码风格

**前端（React）**
- 组件用函数组件 + Hook，不用 class component
- 文件名用 PascalCase（如 `CourseCard.jsx`），Hook 用 camelCase（如 `useCourses.js`）
- 尽量用 Tailwind 类名，不写内联样式

**后端（Python）**
- 遵循 PEP 8
- 路由只做参数校验和返回，业务逻辑放 `services/`
- 接口统一用 `{ code, data, message }` 格式返回

---

## 可以怎么贡献

不一定要写代码，以下都算贡献：

- 🐛 发现并报告 Bug（提 Issue）
- 📝 补充或纠正课程 / 教师数据
- 🌐 改进文档或 README
- 💡 提出新功能建议（提 Issue + 标 `enhancement`）
- 🎨 改进 UI 设计或交互细节
- 🧪 补充测试用例

---

## 有问题？

在 [Issues](https://github.com/your-org/coursecompass/issues) 里问，或者直接在 PR 里评论。我们会尽快回复。
