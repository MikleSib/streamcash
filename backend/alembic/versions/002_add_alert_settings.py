"""Add alert settings table

Revision ID: 002
Revises: 001
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'alert_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('alerts_enabled', sa.Boolean(), nullable=True, default=True),
        sa.Column('min_amount_for_alert', sa.Float(), nullable=True, default=10.0),
        sa.Column('sound_enabled', sa.Boolean(), nullable=True, default=True),
        sa.Column('sound_volume', sa.Float(), nullable=True, default=0.5),
        sa.Column('sound_file_url', sa.String(), nullable=True),
        sa.Column('visual_enabled', sa.Boolean(), nullable=True, default=True),
        sa.Column('alert_duration', sa.Integer(), nullable=True, default=5),
        sa.Column('text_color', sa.String(), nullable=True, default='#FFFFFF'),
        sa.Column('background_color', sa.String(), nullable=True, default='#1F2937'),
        sa.Column('font_size', sa.Integer(), nullable=True, default=24),
        sa.Column('donation_text_template', sa.Text(), nullable=True, default='{donor_name} задонатил {amount}! Сообщение: {message}'),
        sa.Column('anonymous_text_template', sa.Text(), nullable=True, default='Анонимный донат {amount}! Сообщение: {message}'),
        sa.Column('show_anonymous', sa.Boolean(), nullable=True, default=True),
        sa.Column('banned_words', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_alert_settings_id'), 'alert_settings', ['id'], unique=False)
    op.create_index(op.f('ix_alert_settings_user_id'), 'alert_settings', ['user_id'], unique=True)

def downgrade():
    op.drop_index(op.f('ix_alert_settings_user_id'), table_name='alert_settings')
    op.drop_index(op.f('ix_alert_settings_id'), table_name='alert_settings')
    op.drop_table('alert_settings') 