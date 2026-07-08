"""
种子数据脚本 —— 往空数据库里灌入示例数据
==========================================
用法: cd ~/course-compass/backend && source venv/bin/activate && python seed_data.py
效果: 插入 8 门课 + 5 个老师 + 若干评论 + 学分规则
"""
from app import create_app, db
from app.models.course import Course
from app.models.teacher import Teacher
from app.models.comment import Comment
from app.models.credit_rule import CreditRule

app = create_app()

with app.app_context():
    # 清空旧数据（方便重复运行）
    Comment.query.delete()
    Course.query.delete()
    Teacher.query.delete()
    CreditRule.query.delete()

    # ========================
    #   1. 创建老师
    # ========================
    teachers = [
        Teacher(name="张明远", title="教授", department="数学科学学院",
                rating=4.5, bio="研究领域：代数与数论，教学经验 20 年"),
        Teacher(name="李婉清", title="副教授", department="计算机科学与技术学院",
                rating=4.2, bio="研究方向：人工智能与机器学习"),
        Teacher(name="王建国", title="教授", department="物理学院",
                rating=4.8, bio="国家级教学名师，主讲大学物理"),
        Teacher(name="陈思雨", title="讲师", department="外国语学院",
                rating=3.9, bio="英语语言文学博士，注重课堂互动"),
        Teacher(name="赵立新", title="副教授", department="经济管理学院",
                rating=4.0, bio="研究领域：微观经济学与行为经济学"),
    ]
    db.session.add_all(teachers)
    db.session.flush()

    # ========================
    #   2. 创建课程
    # ========================
    courses = [
        Course(name="高等数学A(上)", code="MATH1001", department="数学科学学院",
               credits=5.0, semester="2024-2025-1",
               description="函数、极限、导数、积分。理工科必修基础课。",
               holland_type="I,C", rating=4.3, teacher_id=teachers[0].id),
        Course(name="线性代数", code="MATH1002", department="数学科学学院",
               credits=4.0, semester="2024-2025-1",
               description="矩阵运算、向量空间、特征值。科研计算必备工具。",
               holland_type="I,C", rating=4.1, teacher_id=teachers[0].id),
        Course(name="Python程序设计", code="CS1001", department="计算机科学与技术学院",
               credits=3.0, semester="2024-2025-1",
               description="从零开始学编程，掌握 Python 基础语法与项目实战。",
               holland_type="I,R", rating=4.6, teacher_id=teachers[1].id),
        Course(name="大学物理B(上)", code="PHYS1001", department="物理学院",
               credits=4.0, semester="2024-2025-1",
               description="力学、热学、电磁学基础。适合工科学生。",
               holland_type="I,R", rating=4.7, teacher_id=teachers[2].id),
        Course(name="大学英语(3)", code="ENG2001", department="外国语学院",
               credits=2.0, semester="2024-2025-1",
               description="学术英语阅读与写作，培养国际交流能力。",
               holland_type="S,A", rating=3.8, teacher_id=teachers[3].id),
        Course(name="微观经济学", code="ECON1001", department="经济管理学院",
               credits=3.0, semester="2024-2025-1",
               description="供求理论、消费者行为、市场结构分析。",
               holland_type="E,S", rating=4.0, teacher_id=teachers[4].id),
        Course(name="数据结构与算法", code="CS2001", department="计算机科学与技术学院",
               credits=4.0, semester="2024-2025-2",
               description="链表、树、图、排序算法。程序员面试核心内容。",
               holland_type="I,C", rating=4.4, teacher_id=teachers[1].id),
        Course(name="概率论与数理统计", code="MATH2001", department="数学科学学院",
               credits=3.0, semester="2024-2025-2",
               description="随机事件、概率分布、假设检验。数据分析必备。",
               holland_type="I,C", rating=4.2, teacher_id=teachers[0].id),
    ]
    db.session.add_all(courses)
    db.session.flush()

    # ========================
    #   3. 创建评论
    # ========================
    comments = [
        Comment(course_id=courses[2].id, user_nickname="编程小白",
                content="老师讲得很清楚，零基础也能跟上。每节课都有实操练习，强烈推荐！",
                rating=5, is_visible=True),
        Comment(course_id=courses[2].id, user_nickname="大二学长",
                content="课程内容偏简单，有基础的同学可能会觉得进度慢。但老师人很好。",
                rating=4, is_visible=True),
        Comment(course_id=courses[2].id, user_nickname="匿名用户",
                content="这条评论未通过审核，不应该显示在前端",
                rating=1, is_visible=False),
        Comment(course_id=courses[3].id, user_nickname="物理系学委",
                content="王老师讲课太有激情了！物理不再枯燥。考试难度适中。",
                rating=5, is_visible=True),
        Comment(course_id=courses[3].id, user_nickname="大三老油条",
                content="作业有点多，每周都要交。但确实能学到东西。",
                rating=4, is_visible=True),
        Comment(course_id=courses[5].id, user_nickname="经管小萌新",
                content="很多生活中的例子，一点也不枯燥。赵老师很幽默。",
                rating=5, is_visible=True),
    ]
    db.session.add_all(comments)

    # ========================
    #   4. 创建学分规则
    # ========================
    rules = [
        CreditRule(rule_name="通识必修课", category="通识必修",
                   required_credits=30.0, description="全校学生必修的公共基础课"),
        CreditRule(rule_name="通识选修课", category="通识选修",
                   required_credits=12.0, description="跨学科自由选修，拓宽知识面"),
        CreditRule(rule_name="专业必修课", category="专业必修",
                   required_credits=45.0, description="本专业核心课程，必须修读"),
        CreditRule(rule_name="专业选修课", category="专业选修",
                   required_credits=15.0, description="本专业方向内自由选择"),
        CreditRule(rule_name="实践环节", category="实践环节",
                   required_credits=8.0, description="实验、实习、毕业设计等"),
    ]
    db.session.add_all(rules)

    db.session.commit()

    print("✅ 种子数据导入完成！")
    print(f"   👨‍🏫 {Teacher.query.count()} 位老师")
    print(f"   📚 {Course.query.count()} 门课程")
    print(f"   💬 {Comment.query.count()} 条评论")
    print(f"   📋 {CreditRule.query.count()} 条学分规则")
