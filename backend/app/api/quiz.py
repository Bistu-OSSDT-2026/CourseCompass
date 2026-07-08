"""
Holland 职业兴趣测试接口
========================
GET  /api/quiz/questions  → 获取 20 道测试题（四选一格式）
POST /api/quiz/submit     → 提交答案，计算 Holland 类型 + 推荐课程

Holland 六种类型（RIASEC）:
  R = 现实型 (Realistic)  — 喜欢动手操作、使用工具、户外活动
  I = 研究型 (Investigative) — 喜欢思考分析、做实验、解决问题
  A = 艺术型 (Artistic)   — 喜欢创意表达、设计、写作、音乐
  S = 社会型 (Social)     — 喜欢帮助他人、教学、团队合作
  E = 企业型 (Enterprising) — 喜欢领导说服、竞争、商业活动
  C = 常规型 (Conventional) — 喜欢组织规范、数据处理、按流程办事
"""
import json
import os
from flask import Blueprint, request
from app.models.course import Course
from app.api.helpers import ok, bad_request

quiz_bp = Blueprint("quiz", __name__)

# ============================================================
#  从 JSON 文件加载题目（四选一格式）
#  每题 4 个选项，每个选项对应一个 Holland 类型
# ============================================================
def _load_questions():
    json_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "quiz_questions.json"
    )
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["questions"]

QUESTIONS = _load_questions()

# 选项字母 → 数组索引映射
OPTION_MAP = {"A": 0, "B": 1, "C": 2, "D": 3}

# Holland 类型详细信息
HOLLAND_INFO = {
    "R": {"name": "现实型", "desc": "动手操作，喜欢使用工具、机器，偏好户外或体力活动。适合工程、技术类课程。"},
    "I": {"name": "研究型", "desc": "善于观察、思考与分析，喜欢独立解决复杂问题。适合理工科、研究类课程。"},
    "A": {"name": "艺术型", "desc": "富有创造力，喜欢通过文字、音乐、美术表达自己。适合艺术、设计、文学类课程。"},
    "S": {"name": "社会型", "desc": "乐于助人，善于沟通与合作，关注他人的成长。适合教育、心理学、社会服务类课程。"},
    "E": {"name": "企业型", "desc": "自信果断，喜欢领导和说服他人，享受竞争与挑战。适合管理、经济、法律类课程。"},
    "C": {"name": "常规型", "desc": "有条理、注重细节，喜欢按规则和流程办事。适合会计、行政管理、信息管理类课程。"},
}


@quiz_bp.route("/quiz/questions", methods=["GET"])
def get_questions():
    """
    获取测试题
    ----------
    返回 20 道 Holland 四选一测试题。
    每题包含题目文本和 4 个选项（A/B/C/D），每个选项对应一种 Holland 类型。
    """
    return ok({
        "questions": QUESTIONS,
        "total": len(QUESTIONS),
    }, message="测试题获取成功")


@quiz_bp.route("/quiz/submit", methods=["POST"])
def submit_quiz():
    """
    提交测试答案
    ------------
    接收 20 道题的答案（每题选 A/B/C/D），统计每种 Holland 类型的得分，
    找出主导类型，推荐匹配课程。

    请求格式:
    {
        "answers": ["A", "B", "C", "D", "A", ...]   // 20 个，按题号顺序
    }

    每个答案 A/B/C/D 对应每道题的第 1/2/3/4 个选项，
    该选项的 Holland 类型 +1 分。

    返回:
    {
        "holland_type": "I",           // 最高分类型
        "type_name": "研究型",
        "type_description": "...",
        "scores": {"R":2, "I":7, ...}, // 各类型得分
        "recommended_courses": [...]   // 匹配的课程
    }
    """
    data = request.get_json(silent=True)
    if not data or "answers" not in data:
        return bad_request("请提供 answers 字段（20 个答案组成的数组，每个值为 A/B/C/D）")

    answers = data["answers"]
    if not isinstance(answers, list) or len(answers) != 20:
        return bad_request(
            f"answers 必须是包含 20 个元素的数组，当前长度: "
            f"{len(answers) if isinstance(answers, list) else '非数组'}"
        )

    # --- 第1步：统计每种类型的得分 ---
    # 每道题选 A/B/C/D → 查对应选项的 Holland 类型 → 该类型 +1 分
    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}

    for i, answer in enumerate(answers):
        if i >= 20:
            break
        ans = str(answer).strip().upper()
        idx = OPTION_MAP.get(ans, -1)
        if idx < 0:
            continue  # 无效答案，跳过

        question = QUESTIONS[i]
        if idx < len(question["options"]):
            holland_type = question["options"][idx]["type"]
            if holland_type in scores:
                scores[holland_type] += 1

    # --- 第2步：找主导类型 ---
    sorted_types = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary_type, primary_score = sorted_types[0]
    second_type, second_score = sorted_types[1]

    # 如果最高分和次高分相同，取两个（混合型）
    top_types = [primary_type]
    if primary_score == second_score and primary_score > 0:
        top_types.append(second_type)

    # --- 第3步：推荐课程 ---
    # 查询 holland_type 包含主导类型的课程，按评分降序
    courses = (
        Course.query
        .filter(Course.holland_type.contains(primary_type))
        .order_by(Course.rating.desc())
        .limit(6)
        .all()
    )

    # 如果主类型课程不够 3 门，用次类型补充
    if len(courses) < 3 and primary_score > 0:
        existing_ids = {c.id for c in courses}
        extra = (
            Course.query
            .filter(Course.holland_type.contains(second_type))
            .filter(~Course.id.in_(existing_ids))
            .order_by(Course.rating.desc())
            .limit(6 - len(courses))
            .all()
        )
        courses.extend(extra)

    return ok({
        "holland_type": primary_type,
        "type_name": HOLLAND_INFO[primary_type]["name"],
        "type_description": HOLLAND_INFO[primary_type]["desc"],
        "top_types": top_types,
        "scores": scores,
        "all_types": [  # 每种类型的详细信息（给前端画雷达图用）
            {
                "code": code,
                "name": HOLLAND_INFO[code]["name"],
                "desc": HOLLAND_INFO[code]["desc"],
                "score": score,
            }
            for code, score in sorted_types
        ],
        "recommended_courses": [c.to_dict() for c in courses],
    }, message="测评完成")
