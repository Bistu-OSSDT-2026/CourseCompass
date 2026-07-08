"""
CourseCompass - Gunicorn 配置文件
=================================
用法:
  gunicorn -c gunicorn_config.py wsgi:prod_app

Worker 建议值:
  - 开发/个人使用:  workers = 2
  - 小团队服务器:    workers = 4-8 (2×CPU核数 + 1)
  - 生产服务器:      workers = 9+  (根据并发量调整)
"""
import os
import multiprocessing

# ===================== 绑定地址 =====================
# 0.0.0.0 表示监听所有网络接口（局域网 / 公网可访问）
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"

# ===================== Worker 进程 =====================
# 默认使用 CPU 核数 × 2 + 1（适合大部分场景）
workers = int(os.environ.get("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))

# Worker 类型：sync 是最简单的同步 worker，适合低并发场景
# 如果需要高并发，可以装 gevent/eventlet 改成对应的 worker_class
worker_class = "sync"

# 每个 worker 的最大请求数（防止内存泄漏，处理这么多请求后重启 worker）
max_requests = int(os.environ.get("GUNICORN_MAX_REQUESTS", "1000"))
max_requests_jitter = 50  # 随机抖动，防止所有 worker 同时重启

# ===================== 超时设置 =====================
timeout = int(os.environ.get("GUNICORN_TIMEOUT", "30"))      # Worker 超时（秒）
graceful_timeout = int(os.environ.get("GUNICORN_GRACEFUL_TIMEOUT", "10"))  # 优雅关闭超时
keepalive = 3  # Keep-Alive 连接保持时间

# ===================== 日志 =====================
# 日志级别：debug, info, warning, error, critical
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")

# 访问日志格式
accesslog = os.environ.get("GUNICORN_ACCESSLOG", "-")  # "-" = stdout
errorlog = os.environ.get("GUNICORN_ERRORLOG", "-")    # "-" = stderr

# 日志格式：包含请求耗时
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)sµs'

# ===================== 进程管理 =====================
# PID 文件（方便用脚本管理进程）
pidfile = os.environ.get("GUNICORN_PIDFILE", None)

# 以守护进程运行（后台运行）
# 开发时建议 False，生产环境建议 True
daemon = os.environ.get("GUNICORN_DAEMON", "false").lower() == "true"

# ===================== 预加载 =====================
# 启动前预加载应用代码（省内存，但代码热重载会失效）
preload_app = os.environ.get("GUNICORN_PRELOAD", "false").lower() == "true"

# ===================== 安全（可选）=====================
# 如果不是 root，这些设置会被忽略
user = os.environ.get("GUNICORN_USER", None)
group = os.environ.get("GUNICORN_GROUP", None)
