"""
数据库重置脚本
==============
一键清空数据库 + 重新导入种子数据。

⚠️ 警告：会删除所有已有数据，包括用户提交的评论！

使用场景：
  - 替换成真实数据时
  - 数据库损坏时
  - 开发阶段改模型后重新建表

运行方式：
  cd /home/owl123/course-compass/backend
  ./venv/bin/python reset_db.py
"""
from seed_data import seed

if __name__ == "__main__":
    print("=" * 50)
    print("⚠️  即将清空数据库并重新导入...")
    print("=" * 50)
    seed(reset=True)
