from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.StreamerWithUser])
def read_streamers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    streamers = crud.streamer.get_multi(db, skip=skip, limit=limit)
    return streamers

@router.get("/featured", response_model=List[schemas.StreamerWithUser])
def read_featured_streamers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 10,
) -> Any:
    streamers = crud.streamer.get_featured(db, skip=skip, limit=limit)
    return streamers

@router.post("/", response_model=schemas.Streamer)
def create_streamer_profile(
    *,
    db: Session = Depends(deps.get_db),
    streamer_in: schemas.StreamerCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if streamer_in.user_id != current_user.id and not crud.user.is_superuser(current_user):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing_streamer = crud.streamer.get_by_user_id(db, user_id=streamer_in.user_id)
    if existing_streamer:
        raise HTTPException(status_code=400, detail="Streamer profile already exists")
    
    import uuid
    donation_url = f"{streamer_in.display_name.lower().replace(' ', '_')}_{str(uuid.uuid4())[:8]}"
    streamer_data = streamer_in.dict()
    streamer_data["donation_url"] = donation_url
    
    streamer = crud.streamer.create(db, obj_in=streamer_data)
    
    crud.user.update(db, db_obj=current_user, obj_in={"is_streamer": True})
    
    return streamer

@router.get("/me", response_model=schemas.Streamer)
def read_my_streamer_profile(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    streamer = crud.streamer.get_by_user_id(db, user_id=current_user.id)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer profile not found")
    return streamer

@router.put("/me", response_model=schemas.Streamer)
def update_my_streamer_profile(
    *,
    db: Session = Depends(deps.get_db),
    streamer_in: schemas.StreamerUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    streamer = crud.streamer.get_by_user_id(db, user_id=current_user.id)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer profile not found")
    
    streamer = crud.streamer.update(db, db_obj=streamer, obj_in=streamer_in)
    return streamer

@router.get("/{streamer_id}", response_model=schemas.StreamerWithUser)
def read_streamer(
    *,
    db: Session = Depends(deps.get_db),
    streamer_id: int,
) -> Any:
    streamer = crud.streamer.get(db, id=streamer_id)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer not found")
    return streamer

@router.get("/url/{donation_url}", response_model=schemas.StreamerWithUser)
def read_streamer_by_url(
    *,
    db: Session = Depends(deps.get_db),
    donation_url: str,
) -> Any:
    streamer = crud.streamer.get_by_donation_url(db, donation_url=donation_url)
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer not found")
    return streamer 