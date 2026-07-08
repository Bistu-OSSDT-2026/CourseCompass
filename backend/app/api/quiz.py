"""
Holland 职业兴趣测试接口
========================
GET  /api/quiz/questions  → 获取 20 道测试题
POST /api/quiz/submit     → 提交答案，计算 Holland 类型 + 推荐方向

前端已有静态题目和本地计算逻辑，此后端接口作为补充：
- 提供题目数据（备用）
- 接收答案并计算 Holland 类型
- 返回前 2 类型的组合方向 + 数据库中的真实课程推荐

答案格式：20 个 A/B/C/D/E（5 级李克特量表）
  A=非常不符合(1分) B=比较不符合(2分) C=一般(3分) D=比较符合(4分) E=非常符合(5分)
"""
from flask import Blueprint, request
from app.models.course import Course
from app.api.helpers import ok, bad_request

quiz_bp = Blueprint("quiz", __name__)

# ============================================================
#  题目维度映射（与前端 QUESTION_DIMENSIONS 保持一致）
#  R,I,A,S,E,C × 3 + R,I = 20 题
# ============================================================
QUESTION_DIMENSIONS = [
    "R", "I", "A", "S", "E", "C",
    "R", "I", "A", "S", "E", "C",
    "R", "I", "A", "S", "E", "C",
    "R", "I",
]

# 李克特量表分值
LIKERT_SCORES = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}

# 题目文本（GET /api/quiz/questions 返回，前端通常用静态数据）
QUESTIONS = [
    {"id": 1,  "text": "我喜欢动手修理家电或组装家具",                     "dimension": "R"},
    {"id": 2,  "text": "我乐于钻研数学或科学难题",                        "dimension": "I"},
    {"id": 3,  "text": "我经常有创意性的想法，喜欢写作或画画",              "dimension": "A"},
    {"id": 4,  "text": "我享受帮助他人解决困难的过程",                     "dimension": "S"},
    {"id": 5,  "text": "我习惯在团队中担任主导角色，喜欢安排任务",          "dimension": "E"},
    {"id": 6,  "text": "我做事细致，喜欢按流程和规范完成任务",              "dimension": "C"},
    {"id": 7,  "text": "我更愿意动手实践而非阅读理论书籍",                 "dimension": "R"},
    {"id": 8,  "text": "我对事物的运作原理有强烈的好奇心",                 "dimension": "I"},
    {"id": 9,  "text": "我欣赏音乐、戏剧或文学等艺术形式",                 "dimension": "A"},
    {"id": 10, "text": "我乐于教导或辅导学习上有困难的人",                 "dimension": "S"},
    {"id": 11, "text": "我享受说服他人接受我的观点",                      "dimension": "E"},
    {"id": 12, "text": "我擅长整理文件、归档或管理数据",                   "dimension": "C"},
    {"id": 13, "text": "我喜欢使用工具和机械来完成工作",                   "dimension": "R"},
    {"id": 14, "text": "我喜欢独立进行科学实验或研究项目",                 "dimension": "I"},
    {"id": 15, "text": "我经常做白日梦或构想新的创意方案",                 "dimension": "A"},
    {"id": 16, "text": "我乐于倾听朋友倾诉并给予支持",                    "dimension": "S"},
    {"id": 17, "text": "我喜欢制定计划并激励他人一起执行",                 "dimension": "E"},
    {"id": 18, "text": "我在工作中很看重效率和准确性",                     "dimension": "C"},
    {"id": 19, "text": "我享受户外体力劳动或手工制作",                    "dimension": "R"},
    {"id": 20, "text": "我喜欢阅读科学类书籍或观看科普纪录片",             "dimension": "I"},
]

# ============================================================
#  Holland 六种类型详细信息（与前端 HOLLAND_TYPES 一致）
# ============================================================
HOLLAND_TYPES = {
    "R": {
        "code": "R",
        "label": "实用型",
        "fullLabel": "实用型 (Realistic)",
        "icon": "🔧",
        "description": "你喜欢动手解决实际问题，偏好需要体力、工具或机械操作的活动。你务实、坦率、稳定，享受看得见摸得着的成果。",
        "strengths": "动手能力强、注重实际、善于操作工具与设备",
        "suitable": "工程、技术研发、实验操作、户外实践类课程",
    },
    "I": {
        "code": "I",
        "label": "研究型",
        "fullLabel": "研究型 (Investigative)",
        "icon": "🔬",
        "description": "你对事物的运作原理有强烈好奇心，喜欢独立思考和解决复杂问题。你理性、严谨、善于分析，享受探索未知领域。",
        "strengths": "逻辑分析能力强、善于抽象思考、好奇心旺盛",
        "suitable": "理论研究、科学实验、数据分析、算法设计类课程",
    },
    "A": {
        "code": "A",
        "label": "艺术型",
        "fullLabel": "艺术型 (Artistic)",
        "icon": "🎨",
        "description": "你富有创造力，偏好通过文字、音乐、美术等形式表达自我。你想象力丰富、情感敏锐、追求独特性与美感。",
        "strengths": "创意表达出色、审美能力强、善于创新与想象",
        "suitable": "设计、文学创作、视觉艺术、多媒体制作类课程",
    },
    "S": {
        "code": "S",
        "label": "社会型",
        "fullLabel": "社会型 (Social)",
        "icon": "🤝",
        "description": "你乐于帮助他人，善于沟通与合作。你热情、友善、有同理心，享受教导、服务或支持他人的过程。",
        "strengths": "沟通表达能力强、共情能力好、善于团队协作",
        "suitable": "教育、心理咨询、社会工作、客户服务相关课程",
    },
    "E": {
        "code": "E",
        "label": "企业型",
        "fullLabel": "企业型 (Enterprising)",
        "icon": "💼",
        "description": "你享受领导和说服他人，关切商业与政治议题。你自信、有抱负、精力充沛，擅长规划与组织。",
        "strengths": "领导力强、善于说服和激励、具备商业头脑",
        "suitable": "管理学、市场营销、创业实践、公共演讲类课程",
    },
    "C": {
        "code": "C",
        "label": "常规型",
        "fullLabel": "常规型 (Conventional)",
        "icon": "📋",
        "description": "你做事有条理，注重细节和规范，喜欢在结构清晰的环境中完成任务。你细心、可靠、高效，善于管理数据与流程。",
        "strengths": "组织规划能力好、注重细节、执行力强",
        "suitable": "财务管理、行政管理、数据处理、流程优化类课程",
    },
}

# ============================================================
#  方向映射（前 2 类型组合 → 发展方向）
# ============================================================
DIRECTION_MAP = {
    "RI": {"id": "tech", "label": "技术研发方向", "description": "适合走工程师、算法研究路线，将理论与实践结合解决技术问题"},
    "IR": {"id": "tech", "label": "技术研发方向", "description": "适合走工程师、算法研究路线，将理论与实践结合解决技术问题"},
    "RC": {"id": "engineering", "label": "工程实践方向", "description": "适合工程实施、质量管控、标准化作业等实践性强的岗位"},
    "CR": {"id": "engineering", "label": "工程实践方向", "description": "适合工程实施、质量管控、标准化作业等实践性强的岗位"},
    "RE": {"id": "product", "label": "产品管理方向", "description": "适合将动手能力与管理能力结合，走产品研发管理路线"},
    "ER": {"id": "product", "label": "产品管理方向", "description": "适合将动手能力与管理能力结合，走产品研发管理路线"},
    "IA": {"id": "research", "label": "学术研究方向", "description": "适合深耕学术领域，将严谨研究与创新思维结合"},
    "AI": {"id": "research", "label": "学术研究方向", "description": "适合深耕学术领域，将严谨研究与创新思维结合"},
    "IS": {"id": "education", "label": "教育科研方向", "description": "适合教育、科研指导、科普传播等结合教学与研究的工作"},
    "SI": {"id": "education", "label": "教育科研方向", "description": "适合教育、科研指导、科普传播等结合教学与研究的工作"},
    "IC": {"id": "data", "label": "数据分析方向", "description": "适合数据分析、系统架构等需要严谨和数据敏感度的岗位"},
    "CI": {"id": "data", "label": "数据分析方向", "description": "适合数据分析、系统架构等需要严谨和数据敏感度的岗位"},
    "AS": {"id": "creative", "label": "创意传播方向", "description": "适合新媒体、内容创作、文化传播等需要创意与沟通的工作"},
    "SA": {"id": "creative", "label": "创意传播方向", "description": "适合新媒体、内容创作、文化传播等需要创意与沟通的工作"},
    "AE": {"id": "design", "label": "创意设计方向", "description": "适合UI/UX设计、品牌策划、广告创意等商业创意岗位"},
    "EA": {"id": "design", "label": "创意设计方向", "description": "适合UI/UX设计、品牌策划、广告创意等商业创意岗位"},
    "SE": {"id": "management", "label": "管理服务方向", "description": "适合人力资源、项目协调、客户管理等组织管理工作"},
    "ES": {"id": "management", "label": "管理服务方向", "description": "适合人力资源、项目协调、客户管理等组织管理工作"},
    "SC": {"id": "service", "label": "运营服务方向", "description": "适合行政运营、客户服务、流程管理等规范化服务工作"},
    "CS": {"id": "service", "label": "运营服务方向", "description": "适合行政运营、客户服务、流程管理等规范化服务工作"},
    "EC": {"id": "business", "label": "商业运营方向", "description": "适合商业管理、企业运营、供应链管理等结构化商业活动"},
    "CE": {"id": "business", "label": "商业运营方向", "description": "适合商业管理、企业运营、供应链管理等结构化商业活动"},
    "RA": {"id": "maker", "label": "创意实现方向", "description": "适合将动手能力与艺术创意结合，走工业设计、手工创作路线"},
    "AR": {"id": "maker", "label": "创意实现方向", "description": "适合将动手能力与艺术创意结合，走工业设计、手工创作路线"},
    "RS": {"id": "field", "label": "现场服务方向", "description": "适合需要动手能力与社交能力结合的现场技术服务工作"},
    "SR": {"id": "field", "label": "现场服务方向", "description": "适合需要动手能力与社交能力结合的现场技术服务工作"},
    "IE": {"id": "techBiz", "label": "科技创业方向", "description": "适合将技术专长与商业能力结合的科技创业或技术管理岗位"},
    "EI": {"id": "techBiz", "label": "科技创业方向", "description": "适合将技术专长与商业能力结合的科技创业或技术管理岗位"},
    "AC": {"id": "mediaOp", "label": "传媒运营方向", "description": "适合将创意与组织能力结合的内容运营、编辑等岗位"},
    "CA": {"id": "mediaOp", "label": "传媒运营方向", "description": "适合将创意与组织能力结合的内容运营、编辑等岗位"},
}


@quiz_bp.route("/quiz/questions", methods=["GET"])
def get_questions():
    """
    获取测试题（备用接口）
    ------------------
    前端已有静态题目数据，此接口作为后端数据源备用。
    返回 20 道 Holland 测试题，每道题包含 id、题目文本、评测维度。
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
    接收 20 道题的答案（5 级李克特量表 A/B/C/D/E），
    计算 Holland 主导类型 + 组合方向 + 推荐课程。

    请求格式:
    {
        "answers": ["C", "B", "A", "D", "E", ...]   // 20 个，A-E
    }

    返回格式（与前端 QuizResult 页面适配）:
    {
        "typeCode": "IR",              // 前 2 类型组合码
        "typeLabel": "🔬 研究型-实用型",
        "typeDescription": "...",
        "primaryType": { code, icon, label, fullLabel, description, strengths, suitable },
        "secondaryType": { ... },
        "allScores": { "R": 2, "I": 7, ... },
        "direction": { id, label, description, courses: [...] },
        "recommended_courses": [...]   // 数据库中匹配的真实课程
    }
    """
    data = request.get_json(silent=True)
    if not data or "answers" not in data:
        return bad_request("请提供 answers 字段（20 个答案组成的数组，每个值为 A/B/C/D/E）")

    answers = data["answers"]
    if not isinstance(answers, list) or len(answers) != 20:
        return bad_request(
            f"answers 必须是包含 20 个元素的数组，当前长度: "
            f"{len(answers) if isinstance(answers, list) else '非数组'}"
        )

    # --- 第1步：统计每种类型的得分 ---
    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}

    for i, answer in enumerate(answers):
        if i >= 20:
            break
        dim = QUESTION_DIMENSIONS[i]
        ans = str(answer).strip().upper()
        score = LIKERT_SCORES.get(ans, 0)
        scores[dim] += score

    # --- 第2步：按得分降序，取前两个 ---
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top1_code, top1_score = sorted_scores[0]
    top2_code, top2_score = sorted_scores[1]

    type_code = top1_code + top2_code
    primary_type = HOLLAND_TYPES[top1_code]
    secondary_type = HOLLAND_TYPES[top2_code]

    # --- 第3步：查方向映射 ---
    direction_info = DIRECTION_MAP.get(type_code) or DIRECTION_MAP.get(top2_code + top1_code)

    # 从数据库查真实课程（如果库里有匹配 Holland 类型的课则返回，否则返回空列表）
    direction = None
    if direction_info:
        direction = {
            "id": direction_info["id"],
            "label": direction_info["label"],
            "description": direction_info["description"],
            "courses": [],  # 由前端静态数据或数据库补充
        }

    # --- 第4步：数据库课程推荐 ---
    # 用主导类型匹配，按评分降序
    recommended_courses = (
        Course.query
        .filter(Course.holland_type.contains(top1_code))
        .order_by(Course.rating.desc())
        .limit(6)
        .all()
    )

    # 主类型不够 3 门，用次类型补充
    if len(recommended_courses) < 3 and top1_score > 0:
        existing_ids = {c.id for c in recommended_courses}
        extra = (
            Course.query
            .filter(Course.holland_type.contains(top2_code))
            .filter(~Course.id.in_(existing_ids))
            .order_by(Course.rating.desc())
            .limit(6 - len(recommended_courses))
            .all()
        )
        recommended_courses.extend(extra)

    # 用数据库课程填充 direction.courses（如果数据库有课则用数据库，否则回退到占位）
    if direction and recommended_courses:
        direction["courses"] = [
            {
                "name": c.name,
                "credit": int(c.credits) if c.credits else 0,
                "type": c.department or "专业选修",
            }
            for c in recommended_courses[:3]
        ]

    return ok({
        "typeCode": type_code,
        "typeLabel": f"{primary_type['icon']} {primary_type['label']}-{secondary_type['label']}",
        "typeDescription": primary_type["description"],
        "primaryType": primary_type,
        "secondaryType": secondary_type,
        "allScores": scores,
        "direction": direction,
        "recommended_courses": [c.to_dict() for c in recommended_courses],
    }, message="测评完成")
