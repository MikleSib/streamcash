from typing import Any
import os
import uuid
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import deps
from app.core.config import settings
from app.services.websocket_service import notify_new_donation

router = APIRouter()

# Разрешенные типы файлов
ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"]
ALLOWED_IMAGE_TYPES = ["image/gif", "image/png", "image/jpeg", "image/jpg", "image/webp"]
MAX_AUDIO_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGE_SIZE = 20 * 1024 * 1024  # 20MB

def save_uploaded_file(file: UploadFile, folder: str) -> str:
    """Сохраняет загруженный файл и возвращает URL"""
    # Создаем директории если их нет
    upload_dir = Path(settings.UPLOAD_DIR) / folder
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Генерируем уникальное имя файла
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / unique_filename
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Возвращаем URL для доступа к файлу
    return f"/static/uploads/{folder}/{unique_filename}"

@router.post("/upload/audio")
async def upload_audio_file(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    file: UploadFile = File(...),
) -> dict:
    """
    Загрузить аудио файл для алертов
    """
    # Проверяем тип файла
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Неподдерживаемый тип файла. Разрешены: {', '.join(ALLOWED_AUDIO_TYPES)}"
        )
    
    # Проверяем размер файла
    file.file.seek(0, 2)  # Переходим в конец файла
    file_size = file.file.tell()
    file.file.seek(0)  # Возвращаемся в начало
    
    if file_size > MAX_AUDIO_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Файл слишком большой. Максимальный размер: {MAX_AUDIO_SIZE // (1024*1024)}MB"
        )
    
    try:
        file_url = save_uploaded_file(file, "audio")
        return {
            "success": True,
            "file_url": file_url,
            "filename": file.filename,
            "size": file_size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении файла: {str(e)}")

@router.post("/upload/image")
async def upload_image_file(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    file: UploadFile = File(...),
) -> dict:
    """
    Загрузить изображение/GIF для алертов
    """
    # Проверяем тип файла
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Неподдерживаемый тип файла. Разрешены: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Проверяем размер файла
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Файл слишком большой. Максимальный размер: {MAX_IMAGE_SIZE // (1024*1024)}MB"
        )
    
    try:
        file_url = save_uploaded_file(file, "images")
        return {
            "success": True,
            "file_url": file_url,
            "filename": file.filename,
            "size": file_size,
            "type": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении файла: {str(e)}")

@router.delete("/upload/file")
async def delete_uploaded_file(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    file_url: str = Query(..., description="URL файла для удаления"),
) -> dict:
    """
    Удалить загруженный файл
    """
    try:
        # Проверяем, что файл принадлежит пути uploads
        if not file_url.startswith("/static/uploads/"):
            raise HTTPException(status_code=400, detail="Недопустимый путь к файлу")
        
        # Получаем путь к файлу
        file_path = Path(settings.UPLOAD_DIR) / file_url.replace("/static/uploads/", "")
        
        # Удаляем файл если он существует
        if file_path.exists():
            file_path.unlink()
            return {"success": True, "message": "Файл удален"}
        else:
            raise HTTPException(status_code=404, detail="Файл не найден")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении файла: {str(e)}")

@router.get("/upload/files")
async def get_user_files(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> dict:
    """
    Получить список всех загруженных файлов пользователя
    """
    try:
        # Получаем настройки пользователя
        settings_obj = crud.alert_settings.get_by_user_id(db, user_id=current_user.id)
        if not settings_obj or not settings_obj.tiers:
            return {"audio_files": [], "image_files": []}
        
        audio_files = []
        image_files = []
        
        # Собираем все файлы из тиров
        for tier in settings_obj.tiers:
            if tier.get('sound_file_url') and tier['sound_file_url'].startswith('/static/uploads/'):
                audio_files.append({
                    "url": tier['sound_file_url'],
                    "tier_name": tier.get('name', 'Неизвестный уровень')
                })
            
            if tier.get('gif_url') and tier['gif_url'].startswith('/static/uploads/'):
                image_files.append({
                    "url": tier['gif_url'],
                    "tier_name": tier.get('name', 'Неизвестный уровень')
                })
        
        # Убираем дубликаты
        audio_files = list({file['url']: file for file in audio_files}.values())
        image_files = list({file['url']: file for file in image_files}.values())
        
        return {
            "audio_files": audio_files,
            "image_files": image_files
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка файлов: {str(e)}")

@router.get("/", response_model=schemas.AlertSettings)
def get_alert_settings(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Получить настройки алертов текущего пользователя
    """
    settings = crud.alert_settings.get_or_create_for_user(db, user_id=current_user.id)
    return settings

@router.put("/", response_model=schemas.AlertSettings)
def update_alert_settings(
    *,
    db: Session = Depends(deps.get_db),
    settings_in: schemas.AlertSettingsUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Обновить настройки алертов текущего пользователя
    """
    settings = crud.alert_settings.update_by_user_id(
        db, user_id=current_user.id, obj_in=settings_in
    )
    if not settings:
        settings = crud.alert_settings.create_for_user(
            db, obj_in=schemas.AlertSettingsCreate(**settings_in.dict(exclude_unset=True)), 
            user_id=current_user.id
        )
    return settings

@router.post("/reset", response_model=schemas.AlertSettings)
def reset_alert_settings(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Сбросить настройки алертов к значениям по умолчанию
    """
    from app.crud.crud_alert_settings import create_default_tier
    default_tier = create_default_tier()
    default_settings = schemas.AlertSettingsUpdate(tiers=[default_tier])
    settings = crud.alert_settings.update_by_user_id(
        db, user_id=current_user.id, obj_in=default_settings
    )
    if not settings:
        settings = crud.alert_settings.create_default_for_new_user(db, user_id=current_user.id)
    return settings

@router.post("/test/{amount}")
async def test_alert(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    amount: float,
) -> Any:
    """
    Тестировать алерт с указанной суммой
    """
    # Получаем стримера текущего пользователя
    streamer = crud.streamer.get_by_user_id(db, user_id=current_user.id)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer profile not found")
    
    # Отправляем тестовый донат
    await notify_new_donation({
        "donor_name": "Тестер",
        "amount": amount,
        "message": f"Тестовый донат {amount}₽!",
        "is_anonymous": False
    }, streamer.id, db)
    
    return {"message": f"Test alert sent for {amount}₽"}

@router.post("/tier", response_model=schemas.AlertSettings)
def create_tier(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Создать новый уровень алерта
    """
    from app.crud.crud_alert_settings import create_default_tier
    import logging
    
    logger = logging.getLogger(__name__)
    
    # Получаем текущие настройки
    settings = crud.alert_settings.get_or_create_for_user(db, user_id=current_user.id)
    logger.info(f"Current settings for user {current_user.id}: {len(settings.tiers or [])} tiers")
    
    # Создаем новый тир с уникальным ID
    new_tier = create_default_tier()
    new_tier["id"] = f"tier_{len(settings.tiers) + 1}_{int(__import__('time').time())}"
    new_tier["name"] = f"Уровень {len(settings.tiers) + 1}"
    new_tier["min_amount"] = 1.0
    new_tier["max_amount"] = None
    
    logger.info(f"Created new tier: {new_tier['id']} - {new_tier['name']}")
    
    # Добавляем новый тир к существующим
    current_tiers = list(settings.tiers or [])  # Создаем копию списка
    current_tiers.append(new_tier)
    
    logger.info(f"Total tiers after adding: {len(current_tiers)}")
    
    # Напрямую обновляем тиры в объекте
    settings.tiers = current_tiers
    db.commit()
    db.refresh(settings)
    
    logger.info(f"Final settings: {len(settings.tiers or [])} tiers")
    
    return settings

@router.put("/tier/{tier_id}", response_model=schemas.AlertSettings)
def update_tier(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    tier_id: str,
    tier_data: dict,
) -> Any:
    """
    Обновить конкретный уровень алерта
    """
    # Получаем текущие настройки
    settings = crud.alert_settings.get_by_user_id(db, user_id=current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Alert settings not found")
    
    # Находим и обновляем нужный тир
    updated_tiers = []
    tier_found = False
    
    for tier in settings.tiers or []:
        if tier.get("id") == tier_id:
            # Обновляем найденный тир
            updated_tier = tier.copy()
            updated_tier.update(tier_data)
            updated_tiers.append(updated_tier)
            tier_found = True
        else:
            updated_tiers.append(tier)
    
    if not tier_found:
        raise HTTPException(status_code=404, detail="Tier not found")
    
    # Сохраняем обновленные настройки
    updated_settings = crud.alert_settings.update_by_user_id(
        db, user_id=current_user.id, obj_in=schemas.AlertSettingsUpdate(tiers=updated_tiers)
    )
    
    return updated_settings

@router.delete("/tier/{tier_id}", response_model=schemas.AlertSettings)
def delete_tier(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    tier_id: str,
) -> Any:
    """
    Удалить уровень алерта
    """
    # Получаем текущие настройки
    settings = crud.alert_settings.get_by_user_id(db, user_id=current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Alert settings not found")
    
    # Проверяем, что есть хотя бы 2 тира (нельзя удалить последний)
    if len(settings.tiers or []) <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the last tier")
    
    # Удаляем нужный тир
    updated_tiers = [tier for tier in settings.tiers if tier.get("id") != tier_id]
    
    if len(updated_tiers) == len(settings.tiers):
        raise HTTPException(status_code=404, detail="Tier not found")
    
    # Сохраняем обновленные настройки
    updated_settings = crud.alert_settings.update_by_user_id(
        db, user_id=current_user.id, obj_in=schemas.AlertSettingsUpdate(tiers=updated_tiers)
    )
    
    return updated_settings

@router.get("/widget/{donation_url}", response_class=HTMLResponse)
def get_alert_widget(
    *,
    db: Session = Depends(deps.get_db),
    donation_url: str,
) -> str:
    """
    Получить HTML виджет алертов для OBS по URL стримера
    """
    streamer = crud.streamer.get_by_donation_url(db, donation_url=donation_url)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer not found")
    
    settings = crud.alert_settings.get_or_create_for_user(db, user_id=streamer.user_id)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Виджет алертов DonationAlerts РФ</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                background: transparent;
                overflow: hidden;
                width: 100vw;
                height: 100vh;
                position: relative;
            }}
            
            .alert {{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                padding: 20px 40px;
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                text-align: center;
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 90%;
                word-wrap: break-word;
                z-index: 1000;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.1);
            }}
            
            .alert.show {{
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }}
            
            .alert.hide {{
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }}
            
            .alert.shake {{
                animation: shake 0.6s ease-in-out;
            }}
            
            .donor-name {{
                font-weight: bold;
                margin-bottom: 5px;
            }}
            
            .amount {{
                font-weight: bold;
                font-size: 1.2em;
                margin: 5px 0;
            }}
            
            .message {{
                margin-top: 10px;
                font-style: italic;
                opacity: 0.9;
            }}
            
            .animation-container {{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            }}
            
            .particle {{
                position: absolute;
                pointer-events: none;
                user-select: none;
            }}
            
            @keyframes shake {{
                0%, 100% {{ transform: translate(-50%, -50%) scale(1); }}
                10%, 30%, 50%, 70%, 90% {{ transform: translate(-50%, -50%) scale(1) translateX(-3px); }}
                20%, 40%, 60%, 80% {{ transform: translate(-50%, -50%) scale(1) translateX(3px); }}
            }}
            
            @keyframes sparkle {{
                0% {{ opacity: 0; transform: scale(0) rotate(0deg); }}
                50% {{ opacity: 1; transform: scale(1) rotate(180deg); }}
                100% {{ opacity: 0; transform: scale(0) rotate(360deg); }}
            }}
            
            @keyframes confetti {{
                0% {{ transform: translateY(-100vh) rotate(0deg); opacity: 1; }}
                100% {{ transform: translateY(100vh) rotate(720deg); opacity: 0; }}
            }}
            
            @keyframes fireworks {{
                0% {{ opacity: 0; transform: scale(0.5); }}
                25% {{ opacity: 1; transform: scale(1.2); }}
                50% {{ opacity: 1; transform: scale(1); }}
                100% {{ opacity: 0; transform: scale(1.5); }}
            }}
            
            @keyframes hearts {{
                0% {{ opacity: 0; transform: translateY(0) scale(0.5); }}
                20% {{ opacity: 1; transform: translateY(-20px) scale(1); }}
                100% {{ opacity: 0; transform: translateY(-100px) scale(0.5); }}
            }}
            
            .sparkle {{ animation: sparkle 2s ease-in-out; }}
            .confetti {{ animation: confetti 3s linear; }}
            .firework {{ animation: fireworks 2s ease-out; }}
            .heart {{ animation: hearts 3s ease-out; }}
        </style>
    </head>
    <body>
        <div id="alert" class="alert"></div>
        <div id="animationContainer" class="animation-container"></div>
        
        <script>
            const alertElement = document.getElementById('alert');
            const animationContainer = document.getElementById('animationContainer');
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsHost = window.location.host;
            const wsUrl = `${{wsProtocol}}//${{wsHost}}/api/v1/ws/ws/{streamer.id}`;
            
            let socket;
            let currentTimeout;
            let audioContext;
            
            // Настройки алертов из бэкенда
            const alertSettings = {{
                enabled: {str(settings.alerts_enabled).lower()},
                tiers: {settings.tiers or []}
            }};
            
            // Инициализация аудио контекста
            function initAudio() {{
                if (!audioContext) {{
                    try {{
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    }} catch (e) {{
                        console.log('Audio not supported');
                    }}
                }}
            }}
            
            // Поиск подходящего тира для суммы
            function findTierForAmount(amount) {{
                for (let tier of alertSettings.tiers) {{
                    if (amount >= tier.min_amount) {{
                        if (!tier.max_amount || amount <= tier.max_amount) {{
                            return tier;
                        }}
                    }}
                }}
                return alertSettings.tiers[alertSettings.tiers.length - 1]; // Последний тир
            }}
            
            // Воспроизведение звука
            async function playSound(soundUrl, volume) {{
                if (!soundUrl) return;
                
                try {{
                    const audio = new Audio(soundUrl);
                    audio.volume = volume || 0.5;
                    await audio.play();
                }} catch (error) {{
                    console.log('Sound playback failed:', error);
                }}
            }}
            
            // Создание анимации
            function createAnimation(type, tier) {{
                if (!tier.animation_enabled || type === 'none') return;
                
                animationContainer.innerHTML = '';
                
                switch (type) {{
                    case 'sparkles':
                        createSparkles();
                        break;
                    case 'confetti':
                        createConfetti();
                        break;
                    case 'fireworks':
                        createFireworks();
                        break;
                    case 'hearts':
                        createHearts();
                        break;
                    case 'gif':
                        if (tier.gif_url) {{
                            createGif(tier.gif_url);
                        }}
                        break;
                }}
            }}
            
            function createSparkles() {{
                for (let i = 0; i < 30; i++) {{
                    const sparkle = document.createElement('div');
                    sparkle.className = 'particle sparkle';
                    sparkle.innerHTML = '✨';
                    sparkle.style.left = Math.random() * 100 + '%';
                    sparkle.style.top = Math.random() * 100 + '%';
                    sparkle.style.animationDelay = Math.random() * 2 + 's';
                    sparkle.style.fontSize = (12 + Math.random() * 12) + 'px';
                    animationContainer.appendChild(sparkle);
                    
                    setTimeout(() => sparkle.remove(), 2000);
                }}
            }}
            
            function createConfetti() {{
                const colors = ['🎊', '🎉', '🎈', '🎁', '⭐', '🌟'];
                for (let i = 0; i < 50; i++) {{
                    const confetti = document.createElement('div');
                    confetti.className = 'particle confetti';
                    confetti.innerHTML = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.animationDelay = Math.random() * 1 + 's';
                    confetti.style.fontSize = (16 + Math.random() * 16) + 'px';
                    animationContainer.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }}
            }}
            
            function createFireworks() {{
                for (let i = 0; i < 20; i++) {{
                    const firework = document.createElement('div');
                    firework.className = 'particle firework';
                    firework.innerHTML = '🎆';
                    firework.style.left = Math.random() * 100 + '%';
                    firework.style.top = Math.random() * 100 + '%';
                    firework.style.animationDelay = Math.random() * 3 + 's';
                    firework.style.fontSize = (20 + Math.random() * 20) + 'px';
                    animationContainer.appendChild(firework);
                    
                    setTimeout(() => firework.remove(), 2000);
                }}
            }}
            
            function createHearts() {{
                for (let i = 0; i < 15; i++) {{
                    const heart = document.createElement('div');
                    heart.className = 'particle heart';
                    heart.innerHTML = '💖';
                    heart.style.left = Math.random() * 100 + '%';
                    heart.style.animationDelay = Math.random() * 2 + 's';
                    heart.style.fontSize = (14 + Math.random() * 14) + 'px';
                    animationContainer.appendChild(heart);
                    
                    setTimeout(() => heart.remove(), 3000);
                }}
            }}
            
            function createGif(gifUrl) {{
                const gif = document.createElement('img');
                gif.src = gifUrl;
                gif.style.position = 'absolute';
                gif.style.top = '50%';
                gif.style.left = '50%';
                gif.style.transform = 'translate(-50%, -50%)';
                gif.style.maxWidth = '200px';
                gif.style.maxHeight = '200px';
                gif.style.zIndex = '999';
                animationContainer.appendChild(gif);
                
                setTimeout(() => gif.remove(), 5000);
            }}
            
            // Показ алерта
            function showAlert(donation, tier) {{
                if (!alertSettings.enabled || !tier) return;
                
                // Очищаем предыдущий таймаут
                if (currentTimeout) {{
                    clearTimeout(currentTimeout);
                }}
                
                // Форматируем текст
                const formattedText = tier.text_template
                    .replace('{{donor_name}}', donation.donor_name || 'Аноним')
                    .replace('{{amount}}', donation.amount)
                    .replace('{{message}}', donation.message || '');
                
                // Настраиваем стили алерта
                alertElement.innerHTML = formattedText;
                alertElement.style.backgroundColor = tier.background_color;
                alertElement.style.color = tier.text_color;
                alertElement.style.fontSize = tier.font_size + 'px';
                alertElement.style.borderColor = tier.highlight_color || 'rgba(255,255,255,0.1)';
                
                if (tier.highlight_color) {{
                    alertElement.style.boxShadow = `0 0 30px ${{tier.highlight_color}}40`;
                }}
                
                // Показываем алерт
                alertElement.classList.remove('hide');
                alertElement.classList.add('show');
                
                // Тряска экрана
                if (tier.screen_shake) {{
                    alertElement.classList.add('shake');
                    setTimeout(() => alertElement.classList.remove('shake'), 600);
                }}
                
                // Воспроизводим звук
                if (tier.sound_enabled && tier.sound_file_url) {{
                    playSound(tier.sound_file_url, tier.sound_volume);
                }}
                
                // Создаем анимацию
                if (tier.animation_enabled) {{
                    createAnimation(tier.animation_type, tier);
                }}
                
                // Скрываем через время
                currentTimeout = setTimeout(() => {{
                    alertElement.classList.remove('show');
                    alertElement.classList.add('hide');
                    animationContainer.innerHTML = '';
                }}, tier.alert_duration * 1000);
            }}
            
            // Подключение к WebSocket
            function connectWebSocket() {{
                socket = new WebSocket(wsUrl);
                
                socket.onopen = function(event) {{
                    console.log('WebSocket connected');
                }};
                
                socket.onmessage = function(event) {{
                    try {{
                        const data = JSON.parse(event.data);
                        if (data.type === 'donation' && data.donation) {{
                            const donation = data.donation;
                            const tier = data.tier;
                            
                            // Если есть конкретный тир из бэкенда, используем его
                            if (tier) {{
                                showAlert(donation, tier);
                            }} else {{
                                // Иначе ищем подходящий тир локально (для обратной совместимости)
                                const amount = parseFloat(donation.amount);
                                const localTier = findTierForAmount(amount);
                                if (localTier) {{
                                    showAlert(donation, localTier);
                                }}
                            }}
                        }}
                    }} catch (error) {{
                        console.error('Error parsing message:', error);
                    }}
                }};
                
                socket.onclose = function(event) {{
                    console.log('WebSocket disconnected');
                    setTimeout(connectWebSocket, 3000);
                }};
                
                socket.onerror = function(error) {{
                    console.error('WebSocket error:', error);
                }};
            }}
            
            // Инициализация
            document.addEventListener('click', initAudio);
            connectWebSocket();
            
            // Тестовый алерт для проверки
            window.testAlert = function(amount = 100) {{
                const tier = findTierForAmount(amount);
                showAlert({{
                    donor_name: 'TestUser',
                    amount: amount,
                    message: 'Тестовое сообщение!'
                }}, tier);
            }};
        </script>
    </body>
    </html>
    """
    
    return html_content 