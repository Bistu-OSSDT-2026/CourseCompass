"""
老师接口蓝图
============
GET  /api/teachers       → 老师列表（搜索 + 筛选 + 分页）
GET  /api/teachers/<id>  → 老师详情（含该老师所有课程）
"""
from flask import Blueprint, request
from app import db
from app.models.teacher import Teacher
from app.api.helpers import paginate, ok, bad_request, not_found

teachers_bp = Blueprint("teachers", __name__)


@teachers_bp.route("/teachers", methods=["GET"])
def get_teachers():
    """
    老师列表接口
    -----------
    搜索:
      keyword      模糊搜索姓名 + 院系 + 简介

    筛选:
      department   按院系精确匹配
      title        按职称精确匹配（教授 / 副教授 / 讲师 / 助教）

    排序:
      sort_by      排序字段（name / rating / id）
      sort_order   asc(默认) / desc

    分页:
      page         页码，默认 1
      page_size    每页条数，默认 10，上限 50
    """
    # ========================================
    #   第1步：构建查询
    # ========================================
    query = Teacher.query

    # --- 模糊搜索 ---
    keyword = request.args.get("keyword", "").strip()
    if keyword:
        pattern = f"%{keyword}%"
        query = query.filter(
            db.or_(
                Teacher.name.like(pattern),
                Teacher.department.like(pattern),
                Teacher.bio.like(pattern),
            )
        )

    # --- 精确筛选 ---
    department = request.args.get("department", "").strip()
    if department:
        query = query.filter(Teacher.department == department)

    title = request.args.get("title", "").strip()
    if title:
        query = query.filter(Teacher.title == title)

    # ========================================
    #   第2步：排序（白名单校验）
    # ========================================
    ALLOWED_SORT = {
        "id": Teacher.id,
        "name": Teacher.name,
        "rating": Teacher.rating,
    }
    sort_by = request.args.get("sort_by", "id").strip()
    sort_order = request.args.get("sort_order", "asc").strip().lower()
    sort_column = ALLOWED_SORT.get(sort_by, Teacher.id)

    query = query.order_by(
        sort_column.desc() if sort_order == "desc" else sort_column.asc()
    )

    # ========================================
    #   第3步：分页
    # ========================================
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 10, type=int)
    teachers, pagination = paginate(query, page=page, page_size=page_size)

    return ok({
        "teachers": [t.to_dict() for t in teachers],
        "pagination": pagination,
    })


@teachers_bp.route("/teachers/<int:teacher_id>", methods=["GET"])
def get_teacher_detail(teacher_id):
    """
    老师详情接口
    -----------
    返回老师信息 + 他教的所有课程。
    URL 示例: GET /api/teachers/1
    """
    teacher = Teacher.query.get(teacher_id)
    if not teacher:
        return not_found(f"老师不存在 (id={teacher_id})")

    data = teacher.to_dict()
    # teacher.courses 是通过 backref 拿到的课程列表
    data["courses"] = [c.to_dict() for c in teacher.courses] if teacher.courses else []

    return ok(data)
