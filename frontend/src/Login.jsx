import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import './Home.jsx'
import { SlArrowDownCircle } from "react-icons/sl";

const Login = () => {
  const [textgen, setTextgen] = useState('')
  const [qrgen, setQrGen] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMatn, setErrorMatn] = useState('')

  //--qrcod yarat--
  const qryarat = async () => {
    if (!textgen) {
      setErrorMatn('Iltimos, matn kiriting!')
      return
    }
    setErrorMatn('')
    setLoading(true)

    //--qr-cod-backend--
    try {
      const javob = await fetch('http://127.0.0.1:8000/generate.qr/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textgen }),
      })
      //--server natija--
      const natija = await javob.json()

      if (natija.qr_img) {
        setQrGen(natija.qr_img)
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
      <Link to="/" className='All' id='all'>Qr codni skanerlash</Link>
      <br />
      <br />
      <h3>Qr Cod yaratish  <SlArrowDownCircle size={25} /> </h3>
      <input
        className='init'
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
