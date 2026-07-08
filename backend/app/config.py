"""
CourseCompass 配置文件
----------------------
这个文件就像一个「设置面板」，集中管理所有配置项。
以后改数据库路径、开关调试模式，都来这里改就行。
"""
import os

# 获取当前文件所在目录的绝对路径
# __file__ = 当前文件路径
# os.path.abspath() = 转成绝对路径
# os.path.dirname() = 取父目录
BASEDIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """基础配置 - 所有环境共用的设置"""

    # --- 数据库配置 ---
    # SQLite 数据库文件会保存在 backend/ 目录下，叫 course_compass.db
    # 就像在 backend/ 文件夹里放了一个 Excel 文件
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        os.path.dirname(BASEDIR), "course_compass.db"
    )
    # 关闭追踪修改信号（省内存，不关会一直有警告）
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- Flask 配置 ---
    # SECRET_KEY 用于加密 session 等敏感数据
    # 现在用固定值，部署时改成环境变量更安全
    SECRET_KEY = os.environ.get("SECRET_KEY", "course-compass-dev-key-2024")

    # --- JSON 配置 ---
    # 确保中文不乱码
    JSON_AS_ASCII = False
    # 自动整理 JSON 格式（缩进 + 排序）
    JSON_SORT_KEYS = False
