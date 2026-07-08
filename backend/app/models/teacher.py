"""
Teacher 模型 —— 老师表
======================
类比：超市的「员工档案」。
每个老师一条记录，包含基本信息。
"""
from app import db
from datetime import datetime, timezone


class Teacher(db.Model):
    """老师表"""
    __tablename__ = "teachers"

    # ========================
    #   列定义
    # ========================

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 姓名
    name = db.Column(db.String(50), nullable=False)

    # 职称：教授 / 副教授 / 讲师 / 助教
    title = db.Column(db.String(30), default="讲师")

    # 所属院系
    department = db.Column(db.String(50), default="")

    # 综合评分（1~5），由评论分数的平均值算出
    rating = db.Column(db.Float, default=0.0)

    # 个人简介
    bio = db.Column(db.Text, default="")

    # 头像 URL（可选，先留空）
    avatar_url = db.Column(db.String(255), default="")

    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        """转字典"""
        # 计算该老师教了多少门课
        course_count = len(self.courses) if self.courses else 0
        return {
            "id": self.id,
            "name": self.name,
            "title": self.title,
            "department": self.department,
            "rating": round(self.rating, 1),
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "course_count": course_count,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }

    def __repr__(self):
        return f"<Teacher {self.name} - {self.title}>"
