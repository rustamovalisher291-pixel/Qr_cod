import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ism, setIsm] = useState('')

  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!email || !password || !ism) {
      alert("Iltimos, barcha maydonlarni to'ldiring❌")
      return
    }

  const userData = { ism, email, password }
    
  try{
    const response = await fetch('http://127.0.0.1:8000/users/', {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData)  
  })
 
  const data = await response.json()
  if (response.ok) {
    alert("Muvaffaqiyatli ro'yxatdan o'tdinginz")
    console.log(data)
    setEmail('')
    setPassword('')
    setIsm('')
    navigate('/home')
  } else {
    alert("Xatolik " +  (data.detail || "Noma'lum xatolik yuz berdi❌"))
    console.log("Xatolik yuz berdi", data)
  }
 }catch(error) {
   console.error("Xatolik yuz berdi:", error)
   alert("Serverga ulanishda xatolik yuz berdi")
 } 

};

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input 
      required
      type="email" 
      placeholder="email@gmail.com" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} />
      <input 
      required
      type="password" 
      placeholder="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} />
      <input 
      required
      type="text" 
      placeholder="ism" 
      value={ism} 
      onChange={(e) => setIsm(e.target.value)} />
      <button 
      type="submit" 
      >Kirish</button>
    </form>  
    </div>
  )
}

export default Login