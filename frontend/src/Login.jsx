import React, { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import './Home.jsx'

const Login = () => {
  const [textgen, setTextgen] = useState('')
  const [qrgen, setQrGen] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMatn, setErrorMatn] = useState('')

  const qryarat = async () => {
    if (!textgen) {
      setErrorMatn('Iltimos, matn kiriting!')
      return
    }
    setErrorMatn('')
    setLoading(true)
    try {
      const javob = await fetch('http://127.0.0.1:8000/generate.qr/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textgen }),
      })

      const natija = await javob.json()

      if (natija.qr_code) {
        setQrGen(natija.qr_code)
      } else {
        setErrorMatn('QR-cod yaratib bo\'lmadi!')
      }
    } catch (error) {
      console.error('QR-codni yaratishda xatolik yuz berdi!', error)
      setErrorMatn('QR-codni yaratishda xatolik yuz berdi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='body'>
      <Link to="/" className='All' id='all'>Qr condni skanerlash</Link>
      <br />
      <br />  
      <h3 style={{ color: 'white' }}>Qr Cod yaratish</h3>
      <input  
        style={{ 
          width: '300px', 
          height: '30px', 
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          padding: '5px',
          fontSize: '16px',
          outline: 'none',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#000000',
          color:"white"
        }}
        type="text"
        value={textgen}
        onChange={(e) => setTextgen(e.target.value)}
        placeholder="Matn kiriting"
      />
      <button
        className="All"
        id="all"
        disabled={loading}
        onClick={qryarat}
      >
        {loading ? 'Yuklanmoqda...' : 'Qrcodni yaratish'}
      </button>

      {errorMatn && (
        <span style={{ color: 'red', margin: '10px' }}>{errorMatn}</span>
      )}

      {qrgen && (
        <div>
          <h4 style={{ color: 'white' }}>Yaratilgan QR Cod</h4>
          <img src={qrgen} alt="Yaratilgan QR Cod" />
        </div>
      )}
    </div>
  )
}

export default Login
