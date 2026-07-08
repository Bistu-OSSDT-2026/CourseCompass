@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   CourseCompass 后端启动
echo ============================================
echo.

:: ==========================================
:: 选择启动方式
:: ==========================================
echo   请选择启动方式:
echo.
echo   [1] Waitress WSGI (推荐 - Windows 原生)
echo   [2] WSL + Gunicorn (更高性能，需要 WSL)
echo   [3] Flask 开发模式 (调试用，热重载)
echo.
set /p CHOICE="   输入选择 [1/2/3]: "

if "%CHOICE%"=="1" goto :WAITRESS
if "%CHOICE%"=="2" goto :WSL
if "%CHOICE%"=="3" goto :FLASK
goto :WAITRESS

:: ==========================================
:: Waitress 启动
:: ==========================================
:WAITRESS
echo.
echo [INFO] 使用 Waitress WSGI 服务器启动...
echo.

:: 检查虚拟环境
if exist "venv\Scripts\python.exe" (
    set PYTHON=venv\Scripts\python.exe
) else if exist "..\venv\Scripts\python.exe" (
    set PYTHON=..\venv\Scripts\python.exe
) else (
    echo [WARN] 未找到虚拟环境，使用系统 Python
    set PYTHON=python
)

echo   服务地址: http://localhost:5000
echo   健康检查: http://localhost:5000/api/health
echo   局域网:   http://你的IP地址:5000
echo.
echo   按 Ctrl+C 停止服务
echo ============================================
echo.

%PYTHON% -c "from waitress import serve; from wsgi import app; print('[OK] Waitress 启动在 http://0.0.0.0:5000'); serve(app, host='0.0.0.0', port=5000)"
pause
goto :EOF

:: ==========================================
:: WSL + Gunicorn 启动
:: ==========================================
:WSL
echo.
echo [INFO] 通过 WSL 使用 Gunicorn 启动...
echo.

wsl bash -c "cd /mnt/d/大学/开源项目/course-compass/backend && ./start.sh"
pause
goto :EOF

:: ==========================================
:: Flask 开发模式
:: ==========================================
:FLASK
echo.
echo [INFO] Flask 开发模式启动...
echo.

if exist "venv\Scripts\python.exe" (
    venv\Scripts\python.exe run.py
) else if exist "..\venv\Scripts\python.exe" (
    ..\venv\Scripts\python.exe run.py
) else (
    python run.py
)
pause
goto :EOF
