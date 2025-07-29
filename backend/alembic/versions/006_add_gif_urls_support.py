"""Add gif_urls support for multiple animations

Revision ID: 006_add_gif_urls_support
Revises: 005_remove_donor_email
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session
import json

# revision identifiers, used by Alembic.
revision = '006_add_gif_urls_support'
down_revision = '005'
branch_labels = None
depends_on = None

def upgrade():
    """Обновление - добавляем поддержку gif_urls к существующим тирам"""
    bind = op.get_bind()
    session = Session(bind=bind)
    
    try:
        # Получаем все записи alert_settings
        result = session.execute(sa.text("SELECT id, tiers FROM alert_settings WHERE tiers IS NOT NULL"))
        
        for row in result:
            settings_id, tiers_json = row
            
            if tiers_json:
                try:
                    tiers = json.loads(tiers_json) if isinstance(tiers_json, str) else tiers_json
                    
                    if isinstance(tiers, list):
                        updated = False
                        
                        for tier in tiers:
                            if isinstance(tier, dict):
                                # Добавляем gif_urls если его нет
                                if 'gif_urls' not in tier:
                                    tier['gif_urls'] = []
                                    
                                    # Если есть gif_url, добавляем его в gif_urls
                                    if tier.get('gif_url'):
                                        tier['gif_urls'] = [tier['gif_url']]
                                    
                                    updated = True
                                    print(f"Updated tier {tier.get('id', 'unknown')} with gif_urls support")
                        
                        if updated:
                            # Сохраняем обновленные тиры
                            updated_json = json.dumps(tiers)
                            session.execute(
                                sa.text("UPDATE alert_settings SET tiers = :tiers WHERE id = :id"),
                                {"tiers": updated_json, "id": settings_id}
                            )
                            print(f"Updated alert_settings record {settings_id}")
                
                except Exception as e:
                    print(f"Error processing alert_settings {settings_id}: {e}")
                    continue
        
        session.commit()
        print("Migration completed successfully - added gif_urls support to existing alert tiers")
        
    except Exception as e:
        session.rollback()
        print(f"Migration failed: {e}")
        raise
    finally:
        session.close()


def downgrade():
    """Откат - удаляем gif_urls из тиров"""
    bind = op.get_bind()
    session = Session(bind=bind)
    
    try:
        # Получаем все записи alert_settings
        result = session.execute(sa.text("SELECT id, tiers FROM alert_settings WHERE tiers IS NOT NULL"))
        
        for row in result:
            settings_id, tiers_json = row
            
            if tiers_json:
                try:
                    tiers = json.loads(tiers_json) if isinstance(tiers_json, str) else tiers_json
                    
                    if isinstance(tiers, list):
                        updated = False
                        
                        for tier in tiers:
                            if isinstance(tier, dict):
                                # Удаляем gif_urls
                                if 'gif_urls' in tier:
                                    del tier['gif_urls']
                                    updated = True
                        
                        if updated:
                            # Сохраняем обновленные тиры
                            updated_json = json.dumps(tiers)
                            session.execute(
                                sa.text("UPDATE alert_settings SET tiers = :tiers WHERE id = :id"),
                                {"tiers": updated_json, "id": settings_id}
                            )
                
                except Exception as e:
                    print(f"Error processing alert_settings {settings_id}: {e}")
                    continue
        
        session.commit()
        print("Downgrade completed successfully - removed gif_urls from alert tiers")
        
    except Exception as e:
        session.rollback()
        print(f"Downgrade failed: {e}")
        raise
    finally:
        session.close() 