"""
CourseCompass - Flask 应用工厂
================================
这个文件是后端的「大脑」，负责把各个零件组装起来。
"""
import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# 创建数据库实例（全局对象，在工厂函数里绑定到 app）
db = SQLAlchemy()


def create_app(static_folder=None):
    """
    应用工厂函数
    ------------
    static_folder: 前端构建产物目录路径（如 backend/static/），
                   传入后会在生产模式下托管整个 React SPA。
    """
    # 生产模式：前端文件在 static/ 目录
    _static_folder = None
    if static_folder and os.path.isdir(static_folder):
        _static_folder = os.path.abspath(static_folder)

    app = Flask(__name__, static_folder=_static_folder, static_url_path=None)
    app.config["FRONTEND_DIR"] = _static_folder

    # --- 加载配置 ---
    app.config.from_object("app.config.Config")

    # --- 初始化扩展 ---
    db.init_app(app)
    CORS(app)

    # --- 注册蓝图（API 路由）---
    try:
        from app.api.quiz import quiz_bp
        app.register_blueprint(quiz_bp, url_prefix="/api")
    except ImportError:
        pass

    try:
        from app.api.courses import courses_bp
        app.register_blueprint(courses_bp, url_prefix="/api")
    except ImportError:
        pass

    try:
        from app.api.teachers import teachers_bp
        app.register_blueprint(teachers_bp, url_prefix="/api")
    except ImportError:
        pass

    try:
        from app.api.comments import comments_bp
        app.register_blueprint(comments_bp, url_prefix="/api")
    except ImportError:
        pass

    try:
        from app.api.credit import credit_bp
        app.register_blueprint(credit_bp, url_prefix="/api")
    except ImportError:
        pass

    # --- 创建数据库表 ---
    with app.app_context():
        from app.models.course import Course        # noqa: F401
        from app.models.teacher import Teacher      # noqa: F401
        from app.models.comment import Comment      # noqa: F401
        from app.models.credit_rule import CreditRule  # noqa: F401
        db.create_all()

        # --- 数据库迁移：为旧表添加新列（如果不存在）---
        from sqlalchemy import text, inspect
        inspector = inspect(db.engine)
        existing_cols = [c["name"] for c in inspector.get_columns("comments")]

        migrations = [
            ("difficulty", "INTEGER"),
            ("grading", "VARCHAR(10)"),
            ("semester", "VARCHAR(20)"),
        ]
        for col_name, col_type in migrations:
            if col_name not in existing_cols:
                db.session.execute(
                    text(f"ALTER TABLE comments ADD COLUMN {col_name} {col_type}")
                )
        db.session.commit()

    # --- 健康检查接口 ---
    @app.route("/api/health")
    def health_check():
        return {"code": 200, "data": {"status": "ok"}, "message": "服务运行正常"}

    # --- 生产模式：托管前端 SPA ---
    if _static_folder:

        @app.route("/")
        def index():
            """首页"""
            return send_from_directory(_static_folder, "index.html")

        @app.route("/<path:filename>")
        def serve_static(filename):
            """
            静态文件 + SPA 路由。
            如果文件存在 → 直接返回（JS/CSS/图片等）
            如果文件不存在 → 返回 index.html（React Router 处理前端路由）
            """
            file_path = os.path.join(_static_folder, filename)
            if os.path.isfile(file_path):
                return send_from_directory(_static_folder, filename)
            # 不是静态文件 → SPA fallback
            return send_from_directory(_static_folder, "index.html")

    return app
