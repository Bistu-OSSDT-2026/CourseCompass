"""
CourseCompass - WSGI 入口文件
==============================
Gunicorn 启动时使用这个文件，支持开发/生产模式。

用法:
  # 开发模式（仅 API）
  gunicorn wsgi:app -b 0.0.0.0:5000

  # 生产模式（API + 前端静态文件）
  gunicorn wsgi:prod_app -b 0.0.0.0:5000

  # 使用配置文件
  gunicorn -c gunicorn_config.py wsgi:app
"""
import os
import sys
import shutil

# 确保能找到 app 模块
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app import create_app

# ============================
# 开发模式：纯 API 服务
# ============================
app = create_app()

# ============================
# 生产模式：API + 前端静态文件
# ============================
STATIC_DIR = os.path.join(BASE_DIR, "static")
DIST_DIR = os.path.join(BASE_DIR, "..", "Web", "Web", "dist")

# 如果 static/ 不存在，从 dist/ 复制
index_path = os.path.join(STATIC_DIR, "index.html")
dist_index = os.path.join(os.path.abspath(DIST_DIR), "index.html")

if not os.path.isfile(index_path) and os.path.isfile(dist_index):
    print("[WSGI] 复制前端构建产物到 static/ ...")
    if os.path.isdir(STATIC_DIR):
        shutil.rmtree(STATIC_DIR, ignore_errors=True)
    shutil.copytree(os.path.abspath(DIST_DIR), STATIC_DIR)
    print("[WSGI] 复制完成")

if os.path.isfile(index_path):
    print("[WSGI] 生产模式：API + 前端一体化")
    prod_app = create_app(static_folder=STATIC_DIR)
else:
    print("[WSGI] 开发模式：仅 API 服务（未找到前端构建产物）")
    prod_app = create_app()
