import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import './App.css'
import Login from './Login.jsx'
import { Link } from 'react-router-dom'


const Home = () => {
  const [qrCode, setQrCode] = useState('')
  const [fileJoylash, setFileJoylash] = useState(null)
  const [loading, setloading] = useState(false)
  const [errorMatn, setErrorMatn] = useState('')

  const webcomRef = useRef(null)

  const imgExport = async (imgsuratlari) => {
    setloading(true)

    const konvert = new FormData()
    konvert.append("file", imgsuratlari)
    
    try{
      const javob = await fetch('https://qr-cod-backend.onrender.com/scan_qr/', {
      method: "POST", 
      body: konvert  
    });

    const natija = await javob.json()

    if(natija.data) {
      console.log("Backenddan kelgan QR-cod:", natija.data)
      setQrCode(natija.data)
    }
    
    }catch(error) {
      console.error("QR-codni skanerlashda xatolik yuz berdi! (Xatolik yuz berdi!):", error)
      setErrorMatn("iltimos oldin fayl tanlang!")
    }finally {
      setloading(false)
    }
  }
  
  const fileOlish = (e) => {
    const fayl = e.target.files[0]
    if (fayl) {
      setFileJoylash(fayl)
    }
  }

  const faylniYuborish = () => {
    if (!fileJoylash) {
      setErrorMatn("Iltimos, fayl tanlang!")
      return
    }
    imgExport(fileJoylash)
  }

  const capture = () => {
    if (webcomRef.current) {
      const joriyRasm = webcomRef.current.getScreenshot()

      if (joriyRasm){
        imgExport(joriyRasm)
      }else{
        setErrorMatn("Kameradan rasmga olib bo'lmadi!")
      }
    }
  }
  

  return (
    <div className='body'>
      <Link to="/login" className='All' id='all'>Qr Cod yaratish</Link>
            <Webcam className='All'
            audio={false}
            ref={webcomRef}
            screenshotFormat="image/jpeg"
            style={{
              width: "400px",
              height: "300px",
              border: "2px solid black",
              borderRadius: "10px",
              backgroundColor:"rgb(98, 205, 182)",
            }}
            />
            <button className='All'
            id='all'
              onClick={capture}
              disabled={loading}
            > 
              {loading ? "Skanerlanmoqda..." : "Qr kodni skanerlash (Rasmga olish!)"}
            </button>

            <input className='All'
            id='all'
            type='file'
            accept='image/png, image/jpeg'
            onChange={fileOlish}
            disabled={loading} 
            />
            <button className='All'
            id='all'
            onClick={faylniYuborish} 
            disabled={loading}
            >
              {loading ? "Yuklanmooqda..." : "Faylni Yuborish"}
            </button>
            {errorMatn && 
            <span style={{color:'red', margin: "10px" }}>{errorMatn}</span>
            }

            {qrCode && (
              <div style={{
                marginTop: "20px",
                padding: "10px",
                border: "2px solid black",
                borderRadius: "10px"
              }}>
                Skanerlangan QR-cod: {qrCode}
              </div>
            )}              
    </div>
  )
}

export default Home
