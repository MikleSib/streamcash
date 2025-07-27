"""Add alert tiers support

Revision ID: 003
Revises: 002
Create Date: 2025-01-27 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Добавляем новые колонки для многоуровневых алертов
    op.add_column('alert_settings', sa.Column('tiers', sa.JSON(), nullable=True))
    op.add_column('alert_settings', sa.Column('min_display_time', sa.Integer(), nullable=True, default=2))
    op.add_column('alert_settings', sa.Column('max_display_time', sa.Integer(), nullable=True, default=15))
    
    # Заполняем дефолтными значениями
    op.execute("UPDATE alert_settings SET min_display_time = 2 WHERE min_display_time IS NULL")
    op.execute("UPDATE alert_settings SET max_display_time = 15 WHERE max_display_time IS NULL")


def downgrade() -> None:
    # Удаляем новые колонки
    op.drop_column('alert_settings', 'max_display_time')
    op.drop_column('alert_settings', 'min_display_time')
    op.drop_column('alert_settings', 'tiers') 