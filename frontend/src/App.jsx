import React from 'react'
import Login from './Login.jsx'
import Home from './Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>    
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
