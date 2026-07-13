import base64
import io
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from PIL import Image
from pyzbar.pyzbar import decode

from database import engine, Base, get_db
from models import User
from schemas import UserCreate, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scan_qr/")
async def scan_qr_code(file: Optional[UploadFile] = File(None)):
    if not file:
        raise HTTPException(status_code=400, detail="Hech qanday rasm yoki fayl yuborilmadi!")
    
    try:
        contents = await file.read()
        if contents.startswith(b"data:image"):
            base64_data = contents.decode("utf-8").split(",")[1]
            contents = base64.b64decode(base64_data)
        
        image = Image.open(io.BytesIO(contents))
        decoded_objects = decode(image)
        
        if not decoded_objects:
            raise HTTPException(status_code=422, detail="Rasmdan QR-kod topilmadi!")
        
        qr_data = decoded_objects[0].data.decode("utf-8")
        return {"data": qr_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skanerlashda xatolik: {str(e)}")

@app.get("/")
def root():
    return {"status": "Hamma qatlamlar bitta faylda muvaffaqiyatli ishlamoqda!"}