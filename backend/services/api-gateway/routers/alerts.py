from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import HTMLResponse, StreamingResponse
import httpx
import os

router = APIRouter()

# URL основного бэкенда
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8001")

async def make_backend_request(method: str, path: str, **kwargs):
    """Делает запрос к основному бэкенду"""
    async with httpx.AsyncClient() as client:
        url = f"{BACKEND_URL}{path}"
        try:
            response = await client.request(method, url, **kwargs)
            return response
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Backend connection error: {str(e)}")

@router.get("/")
async def get_alert_settings():
    """Получить настройки алертов"""
    response = await make_backend_request("GET", "/api/v1/alerts/")
    return response.json()

@router.put("/")
async def update_alert_settings(settings_data: dict):
    """Обновить настройки алертов"""
    response = await make_backend_request("PUT", "/api/v1/alerts/", json=settings_data)
    return response.json()

@router.post("/reset")
async def reset_alert_settings():
    """Сбросить настройки алертов"""
    response = await make_backend_request("POST", "/api/v1/alerts/reset")
    return response.json()

@router.post("/test/{amount}")
async def test_alert(amount: float):
    """Тестировать алерт"""
    response = await make_backend_request("POST", f"/api/v1/alerts/test/{amount}")
    return response.json()

@router.post("/tier")
async def create_tier():
    """Создать новый уровень алерта"""
    response = await make_backend_request("POST", "/api/v1/alerts/tier")
    return response.json()

@router.put("/tier/{tier_id}")
async def update_tier(tier_id: str, tier_data: dict):
    """Обновить уровень алерта"""
    response = await make_backend_request("PUT", f"/api/v1/alerts/tier/{tier_id}", json=tier_data)
    return response.json()

@router.delete("/tier/{tier_id}")
async def delete_tier(tier_id: str):
    """Удалить уровень алерта"""
    response = await make_backend_request("DELETE", f"/api/v1/alerts/tier/{tier_id}")
    return response.json()

@router.post("/upload/audio")
async def upload_audio_file(file: UploadFile = File(...)):
    """Загрузить аудио файл"""
    files = {"file": (file.filename, file.file, file.content_type)}
    response = await make_backend_request("POST", "/api/v1/alerts/upload/audio", files=files)
    return response.json()

@router.post("/upload/image")
async def upload_image_file(file: UploadFile = File(...)):
    """Загрузить изображение"""
    files = {"file": (file.filename, file.file, file.content_type)}
    response = await make_backend_request("POST", "/api/v1/alerts/upload/image", files=files)
    return response.json()

@router.delete("/upload/file")
async def delete_uploaded_file(file_url: str = Query(...)):
    """Удалить загруженный файл"""
    response = await make_backend_request("DELETE", f"/api/v1/alerts/upload/file?file_url={file_url}")
    return response.json()

@router.get("/upload/files")
async def get_user_files():
    """Получить список файлов пользователя"""
    response = await make_backend_request("GET", "/api/v1/alerts/upload/files")
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
    
    response = await make_backend_request("POST", "/api/v1/alerts/preview-audio", params=params)
    return StreamingResponse(
        response.iter_bytes(),
        media_type=response.headers.get("content-type", "audio/mpeg"),
        headers=dict(response.headers)
    )

@router.post("/tier/{tier_id}/gif")
async def add_gif_to_tier(tier_id: str, gif_url: str = Query(...)):
    """Добавить гифку к уровню"""
    response = await make_backend_request("POST", f"/api/v1/alerts/tier/{tier_id}/gif?gif_url={gif_url}")
    return response.json()

@router.delete("/tier/{tier_id}/gif")
async def remove_gif_from_tier(tier_id: str, gif_url: str = Query(...)):
    """Удалить гифку из уровня"""
    response = await make_backend_request("DELETE", f"/api/v1/alerts/tier/{tier_id}/gif?gif_url={gif_url}")
    return response.json()

@router.get("/tier/{tier_id}/gifs")
async def get_tier_gifs(tier_id: str):
    """Получить гифки уровня"""
    response = await make_backend_request("GET", f"/api/v1/alerts/tier/{tier_id}/gifs")
    return response.json()

@router.get("/widget/{donation_url}", response_class=HTMLResponse)
async def get_alert_widget(donation_url: str):
    """Получить HTML виджет алертов"""
    response = await make_backend_request("GET", f"/api/v1/alerts/widget/{donation_url}")
    return HTMLResponse(content=response.text, status_code=response.status_code)

@router.get("/streamer/{donation_url}")
async def get_streamer_alert_settings(donation_url: str):
    """Получить настройки алертов стримера"""
    response = await make_backend_request("GET", f"/api/v1/alerts/streamer/{donation_url}")
    return response.json()

def setup_dependencies(api_gateway):
    """Настройка зависимостей для роутера"""
    pass 