from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud
from app.core import deps
from app.models.donation import DonationStatus
from app.services.payment_service import PaymentService
from app.services.websocket_service import notify_new_donation

router = APIRouter()

@router.options("/webhook/test")
async def test_webhook_options():
    return {"status": "ok"}

@router.post("/webhook/yookassa")
async def yookassa_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    payment_service = PaymentService()
    
    if payload.get("event") == "payment.succeeded":
        payment_id = payload["object"]["id"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
    return {"status": "ok"}

@router.post("/webhook/tinkoff")
async def tinkoff_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    
    if payload.get("Status") == "CONFIRMED":
        payment_id = payload["PaymentId"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
        return {"status": "ok"}

@router.post("/webhook/tbank")
async def tbank_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    print(f"T-Bank webhook payload: {payload}")
    
    status = payload.get("status")
    payment_id = payload.get("payment_id")
    
    if not payment_id:
        return {"status": "error", "message": "No payment_id provided"}
    
    donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
    if not donation:
        return {"status": "error", "message": "Donation not found"}
    
    if status == "Подтвержден":
        donation = crud.donation.update(
            db, 
            db_obj=donation, 
            obj_in={"status": DonationStatus.COMPLETED}
        )
        
        streamer = crud.streamer.get(db, id=donation.streamer_id)
        if streamer:
            new_total = streamer.current_donations + donation.amount
            crud.streamer.update(
                db, 
                db_obj=streamer, 
                obj_in={"current_donations": new_total}
            )
            
            await notify_new_donation({
                "donor_name": donation.donor_name if not donation.is_anonymous else None,
                "amount": donation.amount,
                "message": donation.message or "",
                "is_anonymous": donation.is_anonymous
            }, streamer.id, db)
    
    elif status in ["Отменен", "Возвращен", "Возвращен частично", "Резервирование отменено"]:
        donation = crud.donation.update(
            db, 
            db_obj=donation, 
            obj_in={"status": DonationStatus.FAILED}
        )
    
    return {"status": "ok"}

@router.post("/webhook/test")
async def test_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    print(f"Test webhook called with request: {request}")
    payload = await request.json()
    print(f"Test webhook payload: {payload}")
    
    if payload.get("status") == "succeeded":
        payment_id = payload["payment_id"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
    return {"status": "ok"}

@router.get("/status/{payment_id}")
async def check_payment_status(
    payment_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment_service = PaymentService()
    status = await payment_service.check_payment_status(payment_id)

    return {
        "payment_id": payment_id,
        "status": status,
        "donation_id": donation.id
    } 