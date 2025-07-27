"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('full_name', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.Column('is_streamer', sa.Boolean(), nullable=True),
    sa.Column('avatar_url', sa.String(), nullable=True),
    sa.Column('bio', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    
    op.create_table('streamers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('display_name', sa.String(), nullable=False),
    sa.Column('stream_title', sa.String(), nullable=True),
    sa.Column('stream_description', sa.Text(), nullable=True),
    sa.Column('donation_goal', sa.Float(), nullable=True),
    sa.Column('current_donations', sa.Float(), nullable=True),
    sa.Column('min_donation_amount', sa.Float(), nullable=True),
    sa.Column('max_donation_amount', sa.Float(), nullable=True),
    sa.Column('donation_url', sa.String(), nullable=True),
    sa.Column('widget_settings', sa.Text(), nullable=True),
    sa.Column('alert_settings', sa.Text(), nullable=True),
    sa.Column('payment_settings', sa.Text(), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.Column('is_featured', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_streamers_id'), 'streamers', ['id'], unique=False)
    
    op.create_table('donations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('donor_id', sa.Integer(), nullable=True),
    sa.Column('recipient_id', sa.Integer(), nullable=False),
    sa.Column('streamer_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('donor_name', sa.String(), nullable=True),
    sa.Column('donor_email', sa.String(), nullable=True),
    sa.Column('payment_method', sa.Enum('YOOKASSA', 'SBERBANK', 'TINKOFF', 'CARD', name='paymentmethod'), nullable=False),
    sa.Column('payment_id', sa.String(), nullable=True),
    sa.Column('payment_url', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', name='donationstatus'), nullable=True),
    sa.Column('is_anonymous', sa.Boolean(), nullable=True),
    sa.Column('is_public', sa.Boolean(), nullable=True),
    sa.Column('is_alert_shown', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['donor_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['streamer_id'], ['streamers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_donations_id'), 'donations', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_donations_id'), table_name='donations')
    op.drop_table('donations')
    op.drop_index(op.f('ix_streamers_id'), table_name='streamers')
    op.drop_table('streamers')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users') 