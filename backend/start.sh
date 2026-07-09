#!/bin/bash
# ===================================================
#  CourseCompass 后端启动脚本（Linux / WSL）
#  Gunicorn 生产模式 | Flask 开发模式
# ===================================================
#  用法:
#    ./start.sh              → Gunicorn 生产模式（推荐）
#    ./start.sh --dev        → Flask 开发模式（热重载，调试用）
#    ./start.sh --prod       → Gunicorn 生产模式 + 前端静态文件
#    ./start.sh --port 8080  → 指定端口
# ===================================================

set -e

# --- 解析参数 ---
MODE="gunicorn"
PORT=5000
STATIC_MODE=""

for arg in "$@"; do
    case $arg in
        --dev)   MODE="flask" ;;
        --prod)  MODE="gunicorn"; STATIC_MODE="prod" ;;
        --port)  shift; PORT="$1"; shift ;;
    esac
done
# 处理 --port 的值
for i in "$@"; do
    if [ "$prev" = "--port" ]; then
        PORT="$i"
    fi
    prev="$i"
done

# --- 切换到脚本所在目录 ---
cd "$(dirname "$0")"
BASE_DIR="$(pwd)"

# --- 激活虚拟环境 ---
if [ -f "./venv/bin/activate" ]; then
    source ./venv/bin/activate
    echo "[OK] 虚拟环境已激活: ./venv"
elif [ -f "./venv-linux/bin/activate" ]; then
    source ./venv-linux/bin/activate
    echo "[OK] 虚拟环境已激活: ./venv-linux"
else
    echo "[WARN] 未找到虚拟环境，使用系统 Python"
fi

# --- 获取 IP ---
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[ -z "$IP" ] && IP="localhost"

# --- 自动更新前端 .env（WSL2 localhost 转发不可靠，直接用 IP）---
ENV_FILE="$BASE_DIR/../Web/Web/.env"
cat > "$ENV_FILE" << ENVEOF
# CourseCompass 前端环境配置
# 由 backend/start.sh 自动生成
BACKEND_URL=http://${IP}:${PORT}
ENVEOF
echo "[OK] 前端 .env 已更新 → BACKEND_URL=http://${IP}:${PORT}"

echo ""
echo "============================================"
echo "  🚀  CourseCompass 后端启动"
echo "============================================"
echo ""
echo "  📡 服务地址:  http://0.0.0.0:$PORT"
echo "  🩺 健康检查:  http://$IP:$PORT/api/health"
echo "  📡 前端代理:  http://$IP:$PORT"
echo ""

# --- 启动服务 ---
if [ "$MODE" = "flask" ]; then
    echo "  🔧 模式: Flask 开发服务器（热重载）"
    echo "============================================"
    echo ""
    python run.py --port "$PORT"
elif [ "$STATIC_MODE" = "prod" ]; then
    echo "  🔧 模式: Gunicorn 生产 + 前端一体化"
    echo "  👷 Workers: $(python -c 'import multiprocessing; print(multiprocessing.cpu_count() * 2 + 1)')"
    echo "============================================"
    echo ""
    gunicorn -c gunicorn_config.py wsgi:prod_app --bind "0.0.0.0:$PORT"
else
    echo "  🔧 模式: Gunicorn 生产（纯 API）"
    echo "  👷 Workers: $(python -c 'import multiprocessing; print(multiprocessing.cpu_count() * 2 + 1)')"
    echo "============================================"
    echo ""
    gunicorn -c gunicorn_config.py wsgi:app --bind "0.0.0.0:$PORT"
fi
