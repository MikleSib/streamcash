from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Request
from fastapi.responses import HTMLResponse, StreamingResponse
import httpx
import os

router = APIRouter()

# URL сервиса алертов
ALERTS_SERVICE_URL = os.getenv("ALERTS_SERVICE_URL", "http://alerts-service:8000")

async def make_alerts_request(method: str, path: str, **kwargs):
    """Делает запрос к сервису алертов"""
    async with httpx.AsyncClient() as client:
        url = f"{ALERTS_SERVICE_URL}{path}"
        
        # Добавляем заголовки аутентификации если они есть в запросе
        headers = kwargs.get('headers', {})
        if 'authorization' in headers:
            kwargs['headers'] = headers
        
        try:
            response = await client.request(method, url, **kwargs)
            return response
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Alerts service connection error: {str(e)}")

@router.get("/")
async def get_alert_settings(request: Request):
    """Получить настройки алертов"""
    headers = dict(request.headers)
    response = await make_alerts_request("GET", "/api/v1/alerts/", headers=headers)
    return response.json()

@router.put("/")
async def update_alert_settings(settings_data: dict, request: Request):
    """Обновить настройки алертов"""
    headers = dict(request.headers)
    response = await make_alerts_request("PUT", "/api/v1/alerts/", json=settings_data, headers=headers)
    return response.json()

@router.post("/reset")
async def reset_alert_settings(request: Request):
    """Сбросить настройки алертов"""
    headers = dict(request.headers)
    response = await make_alerts_request("POST", "/api/v1/alerts/reset", headers=headers)
    return response.json()

@router.post("/test/{amount}")
async def test_alert(amount: float, request: Request):
    """Тестировать алерт"""
    headers = dict(request.headers)
    response = await make_alerts_request("POST", f"/api/v1/alerts/test/{amount}", headers=headers)
    return response.json()

@router.post("/tier")
async def create_tier(request: Request):
    """Создать новый уровень алерта"""
    headers = dict(request.headers)
    response = await make_alerts_request("POST", "/api/v1/alerts/tier", headers=headers)
    return response.json()

@router.put("/tier/{tier_id}")
async def update_tier(tier_id: str, tier_data: dict):
    """Обновить уровень алерта"""
    response = await make_alerts_request("PUT", f"/api/v1/alerts/tier/{tier_id}", json=tier_data)
    return response.json()

@router.delete("/tier/{tier_id}")
async def delete_tier(tier_id: str):
    """Удалить уровень алерта"""
    response = await make_alerts_request("DELETE", f"/api/v1/alerts/tier/{tier_id}")
    return response.json()

@router.post("/upload/audio")
async def upload_audio_file(file: UploadFile = File(...)):
    """Загрузить аудио файл"""
    files = {"file": (file.filename, file.file, file.content_type)}
    response = await make_alerts_request("POST", "/api/v1/alerts/upload/audio", files=files)
    return response.json()

@router.post("/upload/image")
async def upload_image_file(file: UploadFile = File(...)):
    """Загрузить изображение"""
    files = {"file": (file.filename, file.file, file.content_type)}
    response = await make_alerts_request("POST", "/api/v1/alerts/upload/image", files=files)
    return response.json()

@router.delete("/upload/file")
async def delete_uploaded_file(file_url: str = Query(...)):
    """Удалить загруженный файл"""
    response = await make_alerts_request("DELETE", f"/api/v1/alerts/upload/file?file_url={file_url}")
    return response.json()

@router.get("/upload/files")
async def get_user_files(request: Request):
    """Получить список файлов пользователя"""
    headers = dict(request.headers)
    response = await make_alerts_request("GET", "/api/v1/alerts/upload/files", headers=headers)
    return response.json()

@router.post("/preview-audio")
async def preview_trimmed_audio(
    file_url: str = Query(...),
    start_time: float = Query(0.0),
    end_time: float = Query(None)
):
    """Предварительное прослушивание аудио"""
    params = {"file_url": file_url, "start_time": start_time}
    if end_time is not None:
        params["end_time"] = end_time
    
    response = await make_alerts_request("POST", "/api/v1/alerts/preview-audio", params=params)
    return StreamingResponse(
        response.iter_bytes(),
        media_type=response.headers.get("content-type", "audio/mpeg"),
        headers=dict(response.headers)
    )

@router.post("/tier/{tier_id}/gif")
async def add_gif_to_tier(tier_id: str, gif_url: str = Query(...)):
    """Добавить гифку к уровню"""
    response = await make_alerts_request("POST", f"/api/v1/alerts/tier/{tier_id}/gif?gif_url={gif_url}")
    return response.json()

@router.delete("/tier/{tier_id}/gif")
async def remove_gif_from_tier(tier_id: str, gif_url: str = Query(...)):
    """Удалить гифку из уровня"""
    response = await make_alerts_request("DELETE", f"/api/v1/alerts/tier/{tier_id}/gif?gif_url={gif_url}")
    return response.json()

@router.get("/tier/{tier_id}/gifs")
async def get_tier_gifs(tier_id: str):
    """Получить гифки уровня"""
    response = await make_alerts_request("GET", f"/api/v1/alerts/tier/{tier_id}/gifs")
    return response.json()

@router.get("/widget/{donation_url}", response_class=HTMLResponse)
async def get_alert_widget(donation_url: str):
    """Получить HTML виджет алертов"""
    response = await make_alerts_request("GET", f"/api/v1/alerts/widget/{donation_url}")
    return HTMLResponse(content=response.text, status_code=response.status_code)

@router.get("/streamer/{donation_url}")
async def get_streamer_alert_settings(donation_url: str):
    """Получить настройки алертов стримера"""
    response = await make_alerts_request("GET", f"/api/v1/alerts/streamer/{donation_url}")
    return response.json()

def setup_dependencies(api_gateway):
    """Настройка зависимостей для роутера"""
    pass 