"""
Course 模型 —— 课程表
======================
类比：超市里的「商品信息卡」。
每门课是一行，列就是课程的各种属性。
"""
from app import db
from datetime import datetime, timezone


class Course(db.Model):
    """课程表"""
    __tablename__ = "courses"  # 数据库里的表名

    # ========================
    #   列定义（表的字段）
    # ========================

    # 主键：每一行数据的「身份证号」，自动增长，全局唯一
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 课程名称，如 "高等数学A"
    name = db.Column(db.String(100), nullable=False)

    # 课程编号，如 "MATH1001"，unique 保证不重复
    code = db.Column(db.String(20), unique=True, nullable=False)

    # 开课院系，如 "数学科学学院"
    department = db.Column(db.String(50), nullable=False, default="")

    # 学分（可能带小数，如 3.5）
    credits = db.Column(db.Float, nullable=False, default=0)

    # 开课学期，如 "2024-2025-1"
    semester = db.Column(db.String(20), nullable=False, default="")

    # 课程简介（长文本用 Text 类型）
    description = db.Column(db.Text, default="")

    # Holland 职业兴趣类型
    # R=现实型(动手) I=研究型(动脑) A=艺术型 S=社会型 E=企业型 C=常规型
    # 一门课可能有多个类型标签，用逗号分隔存，如 "I,R"
    holland_type = db.Column(db.String(20), default="")

    # 综合评分（1~5），默认 0 代表暂无评分
    rating = db.Column(db.Float, default=0.0)

    # 记录创建时间，自动填当前时间
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # ========================
    #   外键：关联老师
    # ========================
    # 每门课有一个主讲老师（MVP 简化：一对一关系）
    # db.ForeignKey('teachers.id') 指向 teachers 表的 id 列
    teacher_id = db.Column(db.Integer, db.ForeignKey("teachers.id"), nullable=True)

    # ========================
    #   关系定义（ORM 的魔法）
    # ========================
    # backref='courses' 意味着在 Teacher 对象上可以直接用 .courses 拿到他教的所有课
    # lazy='dynamic' 延迟加载，数据多的时候不会一次性全查出来
    teacher = db.relationship("Teacher", backref="courses")

    def to_dict(self):
        """
        把 ORM 对象转成字典 → 方便转 JSON 返回给前端
        这是 RESTful API 的必要方法
        """
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "department": self.department,
            "credits": self.credits,
            "semester": self.semester,
            "description": self.description,
            "holland_type": self.holland_type,
            "rating": round(self.rating, 1),
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.name if self.teacher else None,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }

    def __repr__(self):
        """调试用，print(Course对象) 时显示什么"""
        return f"<Course {self.code} - {self.name}>"
