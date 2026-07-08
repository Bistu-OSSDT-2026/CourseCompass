"""
学分接口蓝图
============
GET   /api/credit-rules    → 获取所有学分规则
POST  /api/credit/calculate → 计算已修/待修学分
"""
from flask import Blueprint, request
from app.models.credit_rule import CreditRule
from app.api.helpers import ok, bad_request

credit_bp = Blueprint("credit", __name__)


@credit_bp.route("/credit-rules", methods=["GET"])
def get_credit_rules():
    """
    获取所有学分规则
    ---------------
    返回数据库中所有 CreditRule 记录。
    """
    rules = CreditRule.query.order_by(CreditRule.id.asc()).all()
    return ok({
        "rules": [r.to_dict() for r in rules],
        "total": len(rules),
    })


@credit_bp.route("/credit/calculate", methods=["POST"])
def calculate_credit():
    """
    学分完成度计算
    -------------
    接收学生已选课程列表，对照数据库里的学分规则，
    算出每类的完成进度。

    请求示例:
    {
        "taken_courses": [
            {"category": "通识必修", "credits": 18.0},
            {"category": "专业必修", "credits": 32.0}
        ]
    }

    返回:
    {
        "summary": [{category, required, earned, remaining, progress}, ...],
        "total_required": 110.0,
        "total_earned": 56.0,
        "total_remaining": 54.0
    }

    核心逻辑（用比喻理解）：
      把学分规则想象成"购物清单"，已选课程是"已买的东西"。
      遍历清单，逐项对照已买的，算出还差多少。
    """
    # --- 第1步：解析请求 ---
    data = request.get_json(silent=True)
    if not data or "taken_courses" not in data:
        return bad_request("请提供 taken_courses 字段")

    taken = data["taken_courses"]
    if not isinstance(taken, list):
        return bad_request("taken_courses 必须是数组")

    # --- 第2步：把已选课程按类别汇总 ---
    # 输入: [{category:"通识必修", credits:18}, {category:"通识必修", credits:6}]
    # 输出: {"通识必修": 24.0}
    earned_by_category = {}
    for item in taken:
        cat = item.get("category", "").strip()
        cred = item.get("credits", 0)
        if cat:
            earned_by_category[cat] = earned_by_category.get(cat, 0) + float(cred)

    # --- 第3步：读取所有学分规则 ---
    rules = CreditRule.query.all()

    # --- 第4步：逐条计算完成情况 ---
    summary = []
    total_required = 0.0
    total_earned = 0.0

    for rule in rules:
        required = float(rule.min_credit)
        earned = earned_by_category.get(rule.category, 0.0)
        remaining = max(0.0, required - earned)

        # 进度：0.0 ~ 1.0（但不超过 1.0）
        progress = min(1.0, earned / required) if required > 0 else 1.0

        total_required += required
        total_earned += earned

        summary.append({
            "category": rule.category,
            "description": rule.description,
            "required": required,
            "earned": round(earned, 1),
            "remaining": round(remaining, 1),
            "progress": round(progress, 2),
        })

    total_remaining = max(0.0, total_required - total_earned)

    return ok({
        "summary": summary,
        "total_required": round(total_required, 1),
        "total_earned": round(total_earned, 1),
        "total_remaining": round(total_remaining, 1),
        "overall_progress": round(min(1.0, total_earned / total_required), 2) if total_required > 0 else 0,
    }, message="计算成功")
