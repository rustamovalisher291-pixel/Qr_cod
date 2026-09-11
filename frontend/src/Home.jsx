import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import './App.css'
import './Login.jsx'
import { Link } from 'react-router-dom'
import { IoIosAddCircleOutline } from "react-icons/io";


const Home = () => {
  const [qrCode, setQrCode] = useState('')
  const [fileJoylash, setFileJoylash] = useState(null)
  const [loading, setloading] = useState(false)
  const [errorMatn, setErrorMatn] = useState('')
  //--webcamera--
  const webcomRef = useRef(null)
  //--input fileJoylash--
  const fileInputRef = useRef(null)
  //--fayl tugam eilganda asosiy ichki tugam ham ishga tushsin--
  const buttonS = () => {
    fileInputRef.current.click();
  }

  const imgExport = async (imgsuratlari) => {
    setloading(true)
    setErrorMatn("")

    let finalFile = null

    if (typeof imgsuratlari === 'string') {
      const res = await fetch(imgsuratlari)
      const blob = await res.blob()
      finalFile = new File([blob], "uploaded_image.jpg", { type: "image/jpeg" })
    }

    const konvert = new FormData()
    konvert.append("file", finalFile || imgsuratlari)


    //'https://qr-cod-backend.onrender.com/scan_qr/',

    try {
      const javob = await fetch('http://127.0.0.1:8000/scan_qr/', {
        method: "POST",
        body: konvert,
      });
      //--jsondan javob--
      const natija = await javob.json()
      //--javobnichiqarish--
      if (javob.ok && natija.data) {
        console.log("QR-cod skanerlash muvaffaqiyatli:", natija.data)
        //--qrCodega yuborish--
        setQrCode(natija.data)
      } else {
        if (typeof natija.detail === 'string') {
          setErrorMatn(natija.detail)
        } else if (Array.isArray(natija.detail) && natija.detail.length > 0) {
          setErrorMatn(natija.detail.map((e) => e.msg).join(", "))
        } else {
          setErrorMatn("QR-codni skanerlashda xatolik yuz berdi!")
        }
      }

    } catch (error) {
      console.error("QR-codni skanerlashda xatolik yuz berdi! (Xatolik yuz berdi!):", error)
      setErrorMatn("iltimos oldin fayl tanlang!")
    } finally {
      setloading(false)
    }
  }

  // --fileolish-- 
  const fileOlish = (e) => {
    const fayl = e.target.files[0]
    if (fayl) {
      setFileJoylash(fayl)
    }
  }
  //--faylni yuborish--
  const faylniYuborish = () => {
    if (!fileJoylash) {
      setErrorMatn("Iltimos, fayl tanlang!")
      return
    }
    imgExport(fileJoylash)
  }
  //--kameradan rasmga olish--
  const capture = async () => {
    if (webcomRef.current) {
      const joriyRasm = webcomRef.current.getScreenshot()

      console.log("Joriy rasm:", joriyRasm)

      if (joriyRasm) {
        setErrorMatn("")
        //--olingan rasmni blob 2lik baytlarga ajratish-- 
        const res = await fetch(joriyRasm)
        const blob = await res.blob()
        const file = new File([blob], "image.jpg", { type: "image/jpeg" })

        imgExport(file)
      } else {
        setErrorMatn("Kameradan rasmga olib bo'lmadi!")
      }
    }
  }


  return (
    <div className='body'>
      <Link to="/login" className='All' id='all'>Qr Cod yaratish</Link>
      <div className="element"></div>
      <Webcam className='All'
        audio={false}
        ref={webcomRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment"
        }}
        style={{
          width: "400px",
          height: "300px",
          border: "2px solid white",
          borderRadius: "10px",
          backgroundColor: "rgb(98, 205, 182)",
        }}
      />
      <button className='All'
        id='all'
        onClick={capture}
        disabled={loading}
      >
        {loading ? "Skanerlanmoqda..." : "Qr kodni skanerlash (Rasmga olish!)"}
      </button>
      <div>
        <input
          ref={fileInputRef}
          className='All'
          id='all'
          type='file'
          accept='image/png, image/jpeg'
          onChange={fileOlish}
          disabled={loading}
          style={{ display: "none" }}
        />
        <label
          onClick={buttonS}
          htmlFor="all"
          id='All'
          style={{
            display: 'inline-flex',
            alignItems: "center",
            gap: "10px",
            fontFamily: "sans-serif"
          }}
        >Faylni yuklash <IoIosAddCircleOutline size={28} /></label>
      </div>
      <button className='All'
        id='all'
        onClick={faylniYuborish}
        disabled={loading}
      >
        {loading ? "Yuklanmooqda..." : "Faylni Yuborish"}
      </button>
      <div className="element"></div>
      {errorMatn &&
        <span style={{ color: 'red', margin: "10px" }}>{errorMatn}</span>
      }

      {qrCode && (
        <div style={{
          marginTop: "20px",
          padding: "10px",
          border: "2px solid white",
          borderRadius: "10px",
          color: "white",
        }}>
          Skanerlangan QR-cod: {qrCode}
        </div>
      )}
    </div>
  )
}

export default Home
