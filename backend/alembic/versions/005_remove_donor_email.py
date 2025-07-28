"""Удаление поля donor_email из таблицы donations

Revision ID: 005_remove_donor_email
Revises: 004_add_test_to_payment_method_enum
Create Date: 2024-01-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.drop_column('donor_email')


def downgrade():
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('donor_email', sa.VARCHAR(), nullable=True))