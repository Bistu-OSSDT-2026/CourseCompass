"""
种子数据脚本 —— 参考示例
========================
真实数据已直接使用 course_compass.db（爬虫产出）。
此脚本仅作为参考，展示如何通过 Python 插入数据。
"""
from app import create_app, db
from app.models.course import Course
from app.models.teacher import Teacher
from app.models.comment import Comment
from app.models.credit_rule import CreditRule

app = create_app()

with app.app_context():
    # 清空旧数据
    Comment.query.delete()
    Course.query.delete()
    Teacher.query.delete()
    CreditRule.query.delete()

    # ========================
    #   1. 老师（字段对齐真实 DB）
    # ========================
    teachers = [
        Teacher(name="张明远", title="教授", department="数学科学学院",
                research="代数与数论", email="zhangmy@bistu.edu.cn",
                rating=4.5, bio="教学经验 20 年"),
        Teacher(name="李婉清", title="副教授", department="计算机科学与技术学院",
                research="人工智能与机器学习", email="liwanq@bistu.edu.cn",
                rating=4.2),
        Teacher(name="王建国", title="教授", department="物理学院",
                research="凝聚态物理", email="wangjg@bistu.edu.cn",
                rating=4.8, bio="国家级教学名师"),
    ]
    db.session.add_all(teachers)
    db.session.flush()

    # ========================
    #   2. 课程（字段对齐真实 DB）
    # ========================
    courses = [
        Course(name="高等数学A(上)", code="MATH1001", department="数学科学学院",
               credit=5.0, type="公共必修", grade="大一",
               description="函数、极限、导数、积分。理工科必修基础课。",
               holland_tags="I,C", direction="学术研究", rating=4.3,
               teacher_id=teachers[0].id),
        Course(name="Python程序设计", code="CS1001", department="计算机科学与技术学院",
               credit=3.0, type="专业必修", grade="大一",
               description="从零开始学编程，掌握 Python 基础语法与项目实战。",
               holland_tags="R,I", direction="技术研发", rating=4.6,
               teacher_id=teachers[1].id),
        Course(name="大学物理B(上)", code="PHYS1001", department="物理学院",
               credit=4.0, type="公共必修", grade="大一",
               description="力学、热学、电磁学基础。适合工科学生。",
               holland_tags="I,R", direction="学术研究", rating=4.7,
               teacher_id=teachers[2].id),
    ]
    db.session.add_all(courses)
    db.session.flush()

    # ========================
    #   3. 评论（字段对齐真实 DB）
    # ========================
    comments = [
        Comment(course_id=courses[1].id, nickname="编程小白",
                content="老师讲得很清楚，零基础也能跟上！", rating=5,
                difficulty=3, grading="正常", semester="2024-2025-1",
                is_visible=True),
        Comment(course_id=courses[1].id, nickname="大二学长",
                content="内容偏简单，有基础的同学可能会觉得进度慢。", rating=4,
                difficulty=2, grading="宽松", semester="2024-2025-1",
                is_visible=True),
    ]
    db.session.add_all(comments)

    # ========================
    #   4. 学分规则（字段对齐真实 DB）
    # ========================
    rules = [
        CreditRule(category="专业必修", min_credit=40.0,
                   description="专业必修课程最低学分要求", apply_to="全部专业"),
        CreditRule(category="专业选修", min_credit=30.0,
                   description="专业选修课程最低学分要求", apply_to="全部专业"),
        CreditRule(category="公共选修", min_credit=10.0,
                   description="公共选修课程最低学分要求", apply_to="全部专业"),
        CreditRule(category="实践环节", min_credit=8.0,
                   description="实践环节最低学分要求", apply_to="全部专业"),
    ]
    db.session.add_all(rules)

    db.session.commit()

    print("✅ 种子数据导入完成！")
    print(f"   👨‍🏫 {Teacher.query.count()} 位老师")
    print(f"   📚 {Course.query.count()} 门课程")
    print(f"   💬 {Comment.query.count()} 条评论")
    print(f"   📋 {CreditRule.query.count()} 条学分规则")
