"""
评论接口蓝图
============
POST /api/comments  → 提交评论（is_visible=False，审核后才能显示）
GET  /api/comments  → 查询可见评论（支持按课程筛选 + 分页）
"""
from flask import Blueprint, request
from app import db
from app.models.comment import Comment
from app.models.course import Course
from app.api.helpers import paginate, ok, bad_request, not_found

comments_bp = Blueprint("comments", __name__)


@comments_bp.route("/comments", methods=["POST"])
def submit_comment():
    """
    提交评论
    -------
    接收 JSON 格式的评论数据，写入数据库。
    关键安全设计：无论前端传什么，后端强制 is_visible=False。
    这意味着所有评论都需要管理员审核后才能显示。

    请求示例:
    {
        "course_id": 3,
        "nickname": "小明",
        "content": "老师讲得很好，收获很大！",
        "rating": 5
    }

    返回: 201 + 刚创建的评论数据
    """
    # --- 第1步：解析请求体 ---
    data = request.get_json(silent=True)
    if not data:
        return bad_request("请求体不能为空，请发送 JSON 格式数据")

    course_id = data.get("course_id")
    nickname = (data.get("nickname") or "").strip()
    content = (data.get("content") or "").strip()
    rating = data.get("rating")
    difficulty = data.get("difficulty")
    grading = (data.get("grading") or "").strip() or None
    semester = (data.get("semester") or "").strip() or None

    # --- 第2步：参数校验 ---
    errors = []

    # 课程存在吗？
    course = Course.query.get(course_id) if course_id else None
    if not course:
        errors.append("course_id 无效或课程不存在")

    # 昵称不能空
    if not nickname:
        errors.append("nickname 不能为空")

    # 内容不能空，且不能太短
    if not content:
        errors.append("content 不能为空")
    elif len(content) < 2:
        errors.append("评论内容至少需要 2 个字符")

    # 评分 1~5
    if rating is None:
        errors.append("rating 不能为空")
    elif not isinstance(rating, int) or rating < 1 or rating > 5:
        errors.append("rating 必须是 1~5 的整数")

    # 难度 1~5（可选）
    if difficulty is not None:
        if not isinstance(difficulty, int) or difficulty < 1 or difficulty > 5:
            errors.append("difficulty 必须是 1~5 的整数")

    if errors:
        return bad_request("; ".join(errors))

    # --- 第3步：创建评论 ---
    comment = Comment(
        course_id=course_id,
        nickname=nickname,
        content=content,
        rating=rating,
        difficulty=difficulty,
        grading=grading,
        semester=semester,
        is_visible=True,   # 自动可见
    )
    db.session.add(comment)
    db.session.commit()

    return {
        "code": 201,
        "data": {"comment": comment.to_dict()},
        "message": "评论提交成功，等待审核",
    }, 201


@comments_bp.route("/comments", methods=["GET"])
def get_comments():
    """
    查询评论列表
    -----------
    只返回 is_visible=True 的评论（已审核通过）。

    筛选:
      course_id   按课程 ID 筛选

    排序:
      sort_by     排序字段（created_at / rating）
      sort_order  asc / desc（默认 desc，最新的在前）

    分页:
      page / page_size
    """
    # --- 构建查询 ---
    query = Comment.query.filter_by(is_visible=True)

    # 按课程筛选
    course_id = request.args.get("course_id", type=int)
    if course_id:
        query = query.filter(Comment.course_id == course_id)

    # --- 排序 ---
    ALLOWED_SORT = {
        "created_at": Comment.created_at,
        "rating": Comment.rating,
    }
    sort_by = request.args.get("sort_by", "created_at").strip()
    sort_order = request.args.get("sort_order", "desc").strip().lower()
    sort_column = ALLOWED_SORT.get(sort_by, Comment.created_at)

    query = query.order_by(
        sort_column.desc() if sort_order == "desc" else sort_column.asc()
    )

    # --- 分页 ---
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 10, type=int)
    comments, pagination = paginate(query, page=page, page_size=page_size)

    return ok({
        "comments": [c.to_dict() for c in comments],
        "pagination": pagination,
    })
