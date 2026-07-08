"""
CreditRule 模型 —— 学分规则表
==============================
对应真实爬虫数据，字段对齐 coursecompass.db
"""
from app import db
from datetime import datetime, timezone


class CreditRule(db.Model):
    """学分规则表"""
    __tablename__ = "credit_rules"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.String(50), nullable=False)            # 专业必修/专业选修/公共选修/实践环节
    min_credit = db.Column(db.Float, nullable=False, default=0.0)  # 最低学分要求
    description = db.Column(db.Text, default="")                    # 备注说明
    apply_to = db.Column(db.String(50), default="全部专业")         # 适用范围
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "min_credit": self.min_credit,
            "description": self.description,
            "apply_to": self.apply_to,
        }

    def __repr__(self):
        return f"<CreditRule {self.category} - {self.min_credit}分>"
