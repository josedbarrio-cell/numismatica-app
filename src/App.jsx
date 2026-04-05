import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { COINS_URL } from './config'
import Busqueda from './pages/Busqueda'
import Detalle from './pages/Detalle'
import Identificar from './pages/Identificar'
import Nav from './components/Nav'

export default function App() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(COINS_URL)
      .then(r => r.json())
      .then(data => { setCoins(data); setLoading(false) })
      .catch(() => { setError('No se pudo cargar el catálogo'); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p style={{ color:'#888', fontSize:18 }}>Cargando catálogo...</p>
    </div>
  )

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p style={{ color:'#c00' }}>{error}</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 0 80px 0' }}>
      <Routes>
        <Route path="/"           element={<Busqueda coins={coins} />} />
        <Route path="/moneda/:id" element={<Detalle coins={coins} />} />
        <Route path="/identificar" element={<Identificar />} />
      </Routes>
      <Nav />
    </div>
  )
}
