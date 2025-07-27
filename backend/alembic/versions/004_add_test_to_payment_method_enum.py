"""Add TEST to payment method enum

Revision ID: 004
Revises: 003_add_alert_tiers
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Добавляем значение TEST в enum paymentmethod
    op.execute("ALTER TYPE paymentmethod ADD VALUE 'TEST'")


def downgrade() -> None:
    # PostgreSQL не поддерживает удаление значений из enum
    # Поэтому downgrade не выполняется
    pass 