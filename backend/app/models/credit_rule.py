"""
CreditRule 模型 —— 学分规则表
==============================
类比：超市的「会员积分规则」。
定义各类课程的学分要求（通识课要修多少分、专业课要修多少分...）
"""
from app import db
from datetime import datetime, timezone


class CreditRule(db.Model):
    """学分规则表"""
    __tablename__ = "credit_rules"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 规则名称，如 "通识必修课学分要求"
    rule_name = db.Column(db.String(100), nullable=False)

    # 学分类别，如 "通识必修" / "通识选修" / "专业必修" / "专业选修"
    category = db.Column(db.String(50), nullable=False)

    # 该类别需要修满的学分
    required_credits = db.Column(db.Float, nullable=False, default=0.0)

    # 备注说明
    description = db.Column(db.Text, default="")

    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "rule_name": self.rule_name,
            "category": self.category,
            "required_credits": self.required_credits,
            "description": self.description,
        }

    def __repr__(self):
        return f"<CreditRule {self.rule_name} - {self.required_credits}分>"
