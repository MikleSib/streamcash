"""Add TBANK to payment method enum

Revision ID: 007
Revises: 006_add_gif_urls_support
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '007'
down_revision = '006_add_gif_urls_support'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Добавляем значение TBANK в enum paymentmethod
    op.execute("ALTER TYPE paymentmethod ADD VALUE 'TBANK'")


def downgrade() -> None:
    # PostgreSQL не поддерживает удаление значений из enum
    # Поэтому downgrade не выполняется
    pass 