"""
CourseCompass 启动入口
======================
用法:
  python run.py              → 开发模式（仅 API 服务，前后端分离）
  python run.py --prod       → 生产模式（API + 前端静态文件一体化）
  python run.py --prod --port 8080  → 指定端口

生产模式下，Flask 直接托管 React 前端，只需一个端口。
其他人可以通过你的 IP 地址访问，比如 http://192.168.1.100:5000
"""
import os
import sys
import shutil
from app import create_app

# --- 检测命令行参数 ---
PROD_MODE = "--prod" in sys.argv
PORT = 5000
for i, arg in enumerate(sys.argv):
    if arg == "--port" and i + 1 < len(sys.argv):
        PORT = int(sys.argv[i + 1])

# --- 查找/准备前端构建产物 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
DIST_DIR = os.path.join(BASE_DIR, "..", "Web", "Web", "dist")

if PROD_MODE:
    # 如果 static/ 不存在或为空，从 dist/ 复制
    index_path = os.path.join(STATIC_DIR, "index.html")
    dist_index = os.path.join(os.path.abspath(DIST_DIR), "index.html")

    if not os.path.isfile(index_path) and os.path.isfile(dist_index):
        print("[PROD] 复制前端构建产物到 static/ ...")
        if os.path.isdir(STATIC_DIR):
            shutil.rmtree(STATIC_DIR, ignore_errors=True)
        shutil.copytree(os.path.abspath(DIST_DIR), STATIC_DIR)
        print("[PROD] 复制完成")
    elif os.path.isfile(index_path):
        print("[PROD] 使用已有的 static/ 前端文件")
    else:
        print("[PROD] 警告: 未找到前端构建产物！")
        print(f"       请先在 Web/Web 目录下运行: npm run build")
        print(f"       或把构建好的 dist/ 文件夹复制到 backend/static/")

# --- 创建应用 ---
if PROD_MODE and os.path.isfile(os.path.join(STATIC_DIR, "index.html")):
    print(f"[PROD] 生产模式启动")
    print(f"       前端目录: {STATIC_DIR}")
    print(f"       访问地址: http://localhost:{PORT}")
    print(f"       局域网:   http://<你的IP>:{PORT}")
    app = create_app(static_folder=STATIC_DIR)
    debug_mode = False
elif PROD_MODE:
    print("[PROD] 前端不可用，仅启动 API 服务")
    app = create_app()
    debug_mode = False
else:
    print("[DEV] 开发模式启动（仅 API）")
    print(f"       API 地址: http://localhost:{PORT}/api")
    app = create_app()
    debug_mode = True

if __name__ == "__main__":
    print("-" * 50)
    app.run(host="0.0.0.0", port=PORT, debug=debug_mode)
