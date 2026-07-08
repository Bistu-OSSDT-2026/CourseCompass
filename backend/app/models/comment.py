"""
Comment 模型 —— 评论表
======================
类比：超市商品的「用户评价卡」。
每条评论挂在某门课下面，有审核机制。
"""
from app import db
from datetime import datetime, timezone


class Comment(db.Model):
    """评论表"""
    __tablename__ = "comment"

    # ========================
    #   列定义
    # ========================

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # --- 外键：这条评论属于哪门课 ---
    # ondelete="CASCADE"：课程被删了，相关评论自动删掉（不会留下孤儿数据）
    course_id = db.Column(
        db.Integer,
        db.ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
    )

    # --- 评论内容 ---
    # 用户昵称
    nickname = db.Column(db.String(50), nullable=False, default="匿名用户")

    # 评论正文
    content = db.Column(db.Text, nullable=False)

    # 评分（1~5 星）
    rating = db.Column(db.Integer, nullable=False)

    # --- 课程难度（1~5 星，可选）---
    difficulty = db.Column(db.Integer, nullable=True, default=None)

    # --- 给分风格（可选：宽松 / 正常 / 严格）---
    grading = db.Column(db.String(10), nullable=True, default=None)

    # --- 选课学期（可选）---
    semester = db.Column(db.String(20), nullable=True, default=None)

    # --- 审核机制 ---
    # is_visible=False → 评论已提交但还没通过审核，前端不显示
    # 管理员审核后改成 True，评论才对外可见
    is_visible = db.Column(db.Boolean, default=False)

    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # --- 反向关系 ---
    # 在 Course 对象上可以用 .comments 拿到所有评论
    course = db.relationship(
        "Course",
        backref="comments",
        foreign_keys=[course_id],
        primaryjoin="Comment.course_id == Course.id",
    )

    def to_dict(self):
        """转字典"""
        return {
            "id": self.id,
            "course_id": self.course_id,
            "course_name": self.course.name if self.course else None,
            "nickname": self.nickname,
            "content": self.content,
            "rating": self.rating,
            "difficulty": self.difficulty,
            "grading": self.grading,
            "semester": self.semester,
            "is_visible": self.is_visible,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }

    def __repr__(self):
        return f"<Comment {self.id} - course:{self.course_id} visible:{self.is_visible}>"
