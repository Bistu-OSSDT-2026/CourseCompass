"""
Course 模型 —— 课程表
======================
对应真实爬虫数据，字段对齐 coursecompass.db
"""
from app import db
from datetime import datetime, timezone


class Course(db.Model):
    """课程表"""
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(50), nullable=False, default="")
    credit = db.Column(db.Float, nullable=False, default=0)
    type = db.Column(db.String(20), nullable=False, default="")        # 专业必修/专业选修/公共必修/公共选修
    grade = db.Column(db.String(10), nullable=False, default="")       # 大一/大二/大三/大四
    description = db.Column(db.Text, default="")
    holland_tags = db.Column(db.String(50), default="")                # "R,I" 逗号分隔
    direction = db.Column(db.String(50), default="")                   # 技术研发/工程实践/...
    rating = db.Column(db.Float, default=0.0)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teachers.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    teacher = db.relationship("Teacher", backref="courses")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "department": self.department,
            "credit": self.credit,
            "type": self.type,
            "grade": self.grade,
            "description": self.description,
            "holland_tags": self.holland_tags,
            "direction": self.direction,
            "rating": round(self.rating, 1),
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.name if self.teacher else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Course {self.code} - {self.name}>"
