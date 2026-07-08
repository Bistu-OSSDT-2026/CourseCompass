"""
课程接口蓝图
============
GET  /api/courses       → 课程列表（搜索 + 筛选 + 分页 + 排序）
GET  /api/courses/<id>  → 课程详情（含该课所有可见评论）
"""
from flask import Blueprint, request
from app import db
from app.models.course import Course
from app.models.comment import Comment
from app.api.helpers import paginate, ok, bad_request, not_found

# 创建蓝图，url_prefix 在工厂函数里设为 /api
courses_bp = Blueprint("courses", __name__)


@courses_bp.route("/courses", methods=["GET"])
def get_courses():
    """
    课程列表接口
    -----------
    支持参数（全部可选，全在 URL 查询字符串里传）:

    搜索:
      keyword      模糊搜索课程名称 + 课程简介

    筛选:
      department   按院系精确匹配
      holland_type 按 Holland 类型模糊匹配（如 "I" 可匹配 "I,R"）
      semester     按学期精确匹配
      teacher_id   按授课老师筛选

    排序:
      sort_by      排序字段（name / credits / rating / id）
      sort_order   asc(默认) / desc

    分页:
      page         页码，默认 1
      page_size    每页条数，默认 10，上限 50
    """
    # ========================================
    #   第1步：构建查询
    # ========================================
    query = Course.query

    # --- 模糊搜索 ---
    keyword = request.args.get("keyword", "").strip()
    if keyword:
        # LIKE '%keyword%' 模糊匹配
        pattern = f"%{keyword}%"
        query = query.filter(
            db.or_(
                Course.name.like(pattern),
                Course.description.like(pattern),
                Course.code.like(pattern),
            )
        )

    # --- 精确筛选 ---
    department = request.args.get("department", "").strip()
    if department:
        query = query.filter(Course.department == department)

    semester = request.args.get("semester", "").strip()
    if semester:
        query = query.filter(Course.semester == semester)

    teacher_id = request.args.get("teacher_id", type=int)
    if teacher_id:
        query = query.filter(Course.teacher_id == teacher_id)

    # holland_type 用模糊匹配（存的是 "I,R" 这种，查 "I" 要能匹配到）
    holland = request.args.get("holland_type", "").strip()
    if holland:
        query = query.filter(Course.holland_type.like(f"%{holland}%"))

    # ========================================
    #   第2步：排序（白名单校验，防 SQL 注入）
    # ========================================
    ALLOWED_SORT_FIELDS = {
        "id": Course.id,
        "name": Course.name,
        "credits": Course.credits,
        "rating": Course.rating,
    }

    sort_by = request.args.get("sort_by", "id").strip()
    sort_order = request.args.get("sort_order", "asc").strip().lower()

    # 白名单校验：不在白名单里的字段一律不用
    sort_column = ALLOWED_SORT_FIELDS.get(sort_by, Course.id)

    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # ========================================
    #   第3步：分页
    # ========================================
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 10, type=int)

    courses, pagination = paginate(query, page=page, page_size=page_size)

    # ========================================
    #   第4步：返回
    # ========================================
    return ok({
        "courses": [c.to_dict() for c in courses],
        "pagination": pagination,
    })


@courses_bp.route("/courses/<int:course_id>", methods=["GET"])
def get_course_detail(course_id):
    """
    课程详情接口
    -----------
    返回一门课的完整信息 + 它的所有可见评论。
    URL 示例: GET /api/courses/3
    """
    course = Course.query.get(course_id)
    if not course:
        return not_found(f"课程不存在 (id={course_id})")

    # 拿这门课下的可见评论，按时间倒序
    visible_comments = (
        Comment.query
        .filter_by(course_id=course_id, is_visible=True)
        .order_by(Comment.created_at.desc())
        .all()
    )

    data = course.to_dict()
    data["comments"] = [c.to_dict() for c in visible_comments]

    return ok(data)
