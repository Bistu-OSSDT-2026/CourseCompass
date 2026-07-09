#!/bin/bash
# ===================================================
#  自动更新前端 .env 中的 WSL IP 地址
#  每次 WSL 重启后运行一次即可
# ===================================================

ENV_FILE="$(dirname "$0")/../Web/Web/.env"

# 获取 WSL IP
IP=$(hostname -I 2>/dev/null | awk '{print $1}')

if [ -z "$IP" ]; then
    echo "[ERROR] 无法获取 WSL IP 地址"
    exit 1
fi

# 写入 .env
cat > "$ENV_FILE" << EOF
# CourseCompass 前端环境配置
# 由 update-frontend-env.sh 自动生成
BACKEND_URL=http://${IP}:5000
EOF

echo "✅ 前端 .env 已更新"
echo "   BACKEND_URL=http://${IP}:5000"
echo ""
echo "⚠️  如果前端正在运行，请重启前端 (Ctrl+C 后重新 npm run dev)"
