import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config'

const API_KEY = ''   // ← se rellena al desplegar

export default function Identificar() {
  const nav = useNavigate()
  const inputRef = useRef()
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target.result)
      setBase64(e.target.result.split(',')[1])
      setResultado(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  async function identificar() {
    if (!base64) return
    if (!API_KEY) {
      setError('Falta configurar la clave de API. Contacta con el administrador.')
      return
    }
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/jpeg', data: base64 }
              },
              {
                type: 'text',
                text: `Eres un experto en numismática española. Analiza esta imagen de una moneda española y devuelve un JSON con este formato exacto, sin texto adicional:
{
  "candidatos": [
    {
      "era": "nombre de la era histórica",
      "denominacion": "denominación de la moneda",
      "ceca": "ciudad o nombre de la ceca",
      "descripcion": "breve descripción de por qué crees que es esta moneda",
      "confianza": "alta|media|baja"
    }
  ]
}
Incluye entre 1 y 3 candidatos ordenados de más a menos probable. El catálogo cubre monedas españolas de los Reyes Católicos hasta Juan Carlos I. Sé específico con la era y denominación.`
              }
            ]
          }]
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      const texto = data.content[0].text
      const json = JSON.parse(texto.replace(/```json|```/g, '').trim())
      setResultado(json.candidatos)
    } catch (e) {
      setError('Error al identificar: ' + e.message)
    } finally {
      setCargando(false)
    }
  }

  const confianzaColor = {
    alta: '#2a6e2a', media: '#b87a00', baja: '#888'
  }

  return (
    <div>
      <div style={{ background:'#8B4513', padding:'16px', color:'#fff',
        display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => nav('/')} style={{ color:'#fff', fontSize:22 }}>←</button>
        <div>
          <h1 style={{ fontSize:18, fontWeight:600 }}>Identificar moneda</h1>
          <p style={{ fontSize:13, opacity:0.8 }}>Foto desde cámara o galería</p>
        </div>
      </div>

      <div style={{ padding:16 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display:'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {!preview ? (
          <div
            onClick={() => inputRef.current.click()}
            style={{
              border:'2px dashed #ccc', borderRadius:12, padding:40,
              textAlign:'center', cursor:'pointer', background:'#fafafa',
            }}
          >
            <div style={{ fontSize:48, marginBottom:12 }}>◎</div>
            <p style={{ color:'#555', fontSize:16, fontWeight:500 }}>
              Toca para hacer una foto
            </p>
            <p style={{ color:'#aaa', fontSize:13, marginTop:6 }}>
              o seleccionar desde la galería
            </p>
          </div>
        ) : (
          <div>
            <img src={preview} alt="Moneda"
              style={{ width:'100%', borderRadius:12, maxHeight:300,
                objectFit:'contain', background:'#f0f0f0' }} />
            <div style={{ display:'flex', gap:10, marginTop:12 }}>
              <button
                onClick={() => { setPreview(null); setBase64(null); setResultado(null) }}
                style={{ flex:1, padding:'12px 0', borderRadius:8,
                  border:'1px solid #ddd', color:'#555', fontSize:15 }}>
                Cambiar foto
              </button>
              <button
                onClick={identificar}
                disabled={cargando}
                style={{ flex:2, padding:'12px 0', borderRadius:8,
                  background:'#8B4513', color:'#fff', fontSize:15,
                  fontWeight:600, opacity: cargando ? 0.7 : 1 }}>
                {cargando ? 'Analizando...' : 'Identificar'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop:16, padding:14, background:'#fff0f0',
            borderRadius:8, color:'#c00', fontSize:14 }}>
            {error}
          </div>
        )}

        {resultado && (
          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:13, color:'#888', fontWeight:600, marginBottom:12 }}>
              RESULTADOS
            </p>
            {resultado.map((c, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:10,
                border:'1px solid #eee', padding:'14px 16px', marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', marginBottom:6 }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:16 }}>{c.denominacion}</p>
                    <p style={{ fontSize:13, color:'#555' }}>{c.era}</p>
                  </div>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:'3px 8px',
                    borderRadius:4, background:'#f5f5f0',
                    color: confianzaColor[c.confianza] || '#888'
                  }}>
                    {c.confianza}
                  </span>
                </div>
                {c.ceca && (
                  <p style={{ fontSize:13, color:'#888', marginBottom:6 }}>
                    Ceca: {c.ceca}
                  </p>
                )}
                <p style={{ fontSize:13, color:'#555', lineHeight:1.5 }}>
                  {c.descripcion}
                </p>
                <button
                  onClick={() => nav(`/?buscar=${encodeURIComponent(c.denominacion)}`)}
                  style={{ marginTop:10, color:'#8B4513', fontSize:13,
                    fontWeight:600, padding:0 }}>
                  Buscar en el catálogo →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
