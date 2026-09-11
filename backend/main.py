import base64
import io

import cv2
import numpy as np
import qrcode.constants
from database import Base, engine
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pyzbar.pyzbar import decode

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://qr-cod.onrender.com", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scan_qr/")
async def scan_qr_code(file: UploadFile | None = File(None)):
    if not file:
        raise HTTPException(
            status_code=400, detail="Hech qanday rasm yoki fayl yuborilmadi!"
        )

    try:
        contents = await file.read()
        if contents.startswith(b"data:image"):
            base64_data = contents.decode("utf-8").split(",")[1]
            contents = base64.b64decode(base64_data)

        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        decoded_objects = decode(img)

        if img is None:
            raise HTTPException(status_code=400, detail="Yaroqsiz rasm!")
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        decode_objects = decode(img)
        if not decode_objects:
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            decoded_objects = decode(gray_img)

        if not decoded_objects:
            _, thresh_img = cv2.threshold(
                gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )
            decoded_objects = decode(thresh_img)

        if not decoded_objects:
            raise HTTPException(status_code=422, detail="Rasmdan QR-kod topilmadi!")

        qr_data = decoded_objects[0].data.decode("utf-8")
        return {"data": qr_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skanerlashda xatolik: {e!s}")


@app.post("/generate.qr/")
async def generate_qr_code(data: dict):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        text = data.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="text yuborilmadi!")
        qr.add_data(data.get("text"))
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffered = io.BytesIO()
        img.save(img_buffered, format="PNG")
        img_str = base64.b64encode(img_buffered.getvalue()).decode("utf-8")

        return {"qr_img": f"data:image/png;base64,{img_str}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR-kod yaratishda xatolik: {e!s}")


def root():
    return {"status": "Hamma qatlamlar bitta faylda muvaffaqiyatli ishlamoqda!"}
