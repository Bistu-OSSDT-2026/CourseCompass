"""
Holland 职业兴趣测试接口
========================
GET  /api/quiz/questions  → 获取 20 道测试题
POST /api/quiz/submit     → 提交答案，计算 Holland 类型 + 推荐课程

Holland 六种类型（RIASEC）:
  R = 现实型 (Realistic)  — 喜欢动手操作、使用工具、户外活动
  I = 研究型 (Investigative) — 喜欢思考分析、做实验、解决问题
  A = 艺术型 (Artistic)   — 喜欢创意表达、设计、写作、音乐
  S = 社会型 (Social)     — 喜欢帮助他人、教学、团队合作
  E = 企业型 (Enterprising) — 喜欢领导说服、竞争、商业活动
  C = 常规型 (Conventional) — 喜欢组织规范、数据处理、按流程办事
"""
from flask import Blueprint, request
from app.models.course import Course
from app.api.helpers import ok, bad_request

quiz_bp = Blueprint("quiz", __name__)

# ============================================================
#  20 道测试题
#  每道题对应一个 Holland 类型，回答 "yes" 即加 1 分
# ============================================================
QUESTIONS = [
    {"id": 1,  "text": "我喜欢动手修理或组装东西",                            "type": "R"},
    {"id": 2,  "text": "我对自然科学的奥秘充满好奇",                          "type": "I"},
    {"id": 3,  "text": "我喜欢绘画、写作或音乐创作",                          "type": "A"},
    {"id": 4,  "text": "我乐于帮助朋友解决困难",                              "type": "S"},
    {"id": 5,  "text": "我喜欢在团队中担任领导者角色",                         "type": "E"},
    {"id": 6,  "text": "我喜欢把物品或文件整理得井井有条",                     "type": "C"},
    {"id": 7,  "text": "我喜欢户外活动或体育运动",                            "type": "R"},
    {"id": 8,  "text": "我喜欢独自思考或做研究",                              "type": "I"},
    {"id": 9,  "text": "我喜欢参观美术馆或听音乐会",                          "type": "A"},
    {"id": 10, "text": "我善于倾听别人的烦恼并给予安慰",                       "type": "S"},
    {"id": 11, "text": "我喜欢参加演讲比赛或辩论",                            "type": "E"},
    {"id": 12, "text": "我做事喜欢按照计划一步一步来",                         "type": "C"},
    {"id": 13, "text": "我对机械或电子设备的工作原理感兴趣",                   "type": "R"},
    {"id": 14, "text": "我喜欢通过实验或数据来验证观点",                       "type": "I"},
    {"id": 15, "text": "我有丰富的想象力，经常产生创意点子",                   "type": "A"},
    {"id": 16, "text": "我喜欢参加志愿活动或社区服务",                         "type": "S"},
    {"id": 17, "text": "我喜欢销售或推销产品",                                "type": "E"},
    {"id": 18, "text": "我注重细节，能发现别人忽略的错误",                     "type": "C"},
    {"id": 19, "text": "我喜欢亲自动手制作东西而不是看书",                     "type": "R"},
    {"id": 20, "text": "我愿意花大量时间钻研一个复杂问题",                     "type": "I"},
]

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
    返回 20 道 Holland 测试题，前端根据这些题目渲染问卷页面。
    每道题包含 id、题目文本、对应的 Holland 类型。
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
    接收 20 道题的答案，统计每种 Holland 类型的得分，
    找出主导类型，推荐匹配课程。

    请求格式:
    {
        "answers": [
            "yes", "no", "yes", "yes", "no",  ...   // 20 个，按题号顺序
        ]
    }

    答案值: "yes" 表示喜欢 +1 分，"no" 不加分

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
        return bad_request("请提供 answers 字段（20 个答案组成的数组）")

    answers = data["answers"]
    if not isinstance(answers, list) or len(answers) != 20:
        return bad_request(f"answers 必须是包含 20 个元素的数组，当前长度: {len(answers) if isinstance(answers, list) else '非数组'}")

    # --- 第1步：统计每种类型的得分 ---
    # 支持两种答题格式:
    #   李克特量表: A=1分, B=2分, C=3分, D=4分, E=5分 (前端格式)
    #   二值格式:   yes/1/true/y = 1分, 其他 = 0分 (原后端格式)
    LIKERT_SCORES = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}

    # 检测答案格式：如果第一个有效答案在 A-E 范围内，则使用李克特计分
    first_answer = str(answers[0]).strip().upper() if answers else ""
    use_likert = first_answer in LIKERT_SCORES

    for i, answer in enumerate(answers):
        if i >= 20:
            break
        question_type = QUESTIONS[i]["type"]
        ans = str(answer).strip()

        if use_likert:
            score = LIKERT_SCORES.get(ans.upper(), 0)
            scores[question_type] += score
        else:
            if ans.lower() in ("yes", "1", "true", "y"):
                scores[question_type] += 1

    # --- 第2步：找主导类型 ---
    # 按得分排序，取最高的
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
