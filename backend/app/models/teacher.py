"""
Teacher 模型 —— 老师表
======================
对应真实爬虫数据（772 位教师），字段对齐 coursecompass.db
"""
from app import db
from datetime import datetime, timezone


class Teacher(db.Model):
    """老师表"""
    __tablename__ = "teacher"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(30), default="讲师")
    department = db.Column(db.String(50), default="")
    research = db.Column(db.Text, default="")            # 研究方向
    email = db.Column(db.String(100), default="")         # 邮箱
    profile_url = db.Column(db.String(255), default="")   # 个人主页
    avatar_url = db.Column(db.String(255), default="")    # 头像
    rating = db.Column(db.Float, default=0.0)             # 综合评分
    bio = db.Column(db.Text, default="")                  # 个人简介
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        course_count = len(self.courses) if self.courses else 0
        return {
            "id": self.id,
            "name": self.name,
            "title": self.title,
            "department": self.department,
            "research": self.research,
            "email": self.email,
            "profile_url": self.profile_url,
            "avatar_url": self.avatar_url,
            "rating": round(self.rating, 1),
            "bio": self.bio,
            "course_count": course_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Teacher {self.name} - {self.title}>"
