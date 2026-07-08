"""
API 辅助工具
============
分页逻辑、参数校验等共用的工具函数。
"""


def paginate(query, page=1, page_size=10, max_page_size=50):
    """
    对 SQLAlchemy 查询做分页。

    参数:
        query: SQLAlchemy 查询对象（还没执行的那种）
        page: 第几页（从 1 开始）
        page_size: 每页条数
        max_page_size: 每页上限（防止恶意请求一次查 10000 条）

    返回:
        (items, pagination_dict) 的元组
        items: 当前页的数据列表
        pagination_dict: 分页信息
    """
    # --- 参数保护 ---
    page = max(1, int(page))                      # 页码不能小于 1
    page_size = min(max(1, int(page_size)), max_page_size)  # 限制 1~50

    # --- 查总数 ---
    total = query.count()

    # --- 算总页数 ---
    total_pages = max(1, (total + page_size - 1) // page_size)

    # --- 修正越界的页码 ---
    if page > total_pages:
        page = total_pages

    # --- 翻页取数据 ---
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    # --- 构建分页信息 ---
    pagination = {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }

    return items, pagination


def ok(data, message="查询成功"):
    """统一成功响应"""
    return {"code": 200, "data": data, "message": message}, 200


def bad_request(message="请求参数有误"):
    """统一参数错误响应"""
    return {"code": 400, "data": None, "message": message}, 400


def not_found(message="资源不存在"):
    """统一 404 响应"""
    return {"code": 404, "data": None, "message": message}, 404
