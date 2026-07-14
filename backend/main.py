import base64
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from PIL import Image
from pyzbar.pyzbar import decode
from database import engine, Base
import qrcode
from models import User

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://qr-cod.onrender.com"],
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

@app.post("/generate.qr/")
async def generate_qr_code(data: dict):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data.get("text"))
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffered = io.BytesIO()
        img.save(img_buffered, format="PNG")
        img_str = base64.b64encode(img_buffered.getvalue()).decode("utf-8")

        return {"qr_code": f"data:image/png;base64,{img_str}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR-kod yaratishda xatolik: {str(e)}")

@app.get("/")
def root():
    return {"status": "Hamma qatlamlar bitta faylda muvaffaqiyatli ishlamoqda!"}
