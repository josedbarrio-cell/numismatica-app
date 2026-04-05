import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG_URL } from '../config'

export default function Busqueda({ coins }) {
  const nav = useNavigate()
  const [texto, setTexto] = useState('')
  const [era, setEra] = useState('')
  const [denom, setDenom] = useState('')
  const [ceca, setCeca] = useState('')

  const eras = useMemo(() =>
    ['', ...new Set(coins.map(c => c.era))].sort(), [coins])

  const denoms = useMemo(() =>
    ['', ...new Set(coins.filter(c => !era || c.era === era).map(c => c.denominacion))].sort(),
    [coins, era])

  const cecas = useMemo(() =>
    ['', ...new Set(coins.filter(c =>
      (!era || c.era === era) && (!denom || c.denominacion === denom)
    ).map(c => c.ceca))].sort(),
    [coins, era, denom])

  const resultados = useMemo(() => {
    const t = texto.toLowerCase()
    return coins.filter(c =>
      (!era   || c.era === era) &&
      (!denom || c.denominacion === denom) &&
      (!ceca  || c.ceca === ceca) &&
      (!t || [c.era, c.denominacion, c.ceca, c.descripcion, c.tipo_desc]
        .some(f => f?.toLowerCase().includes(t)))
    )
  }, [coins, era, denom, ceca, texto])

  // Scroll al inicio cada vez que cambia cualquier filtro
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [era, denom, ceca, texto])

  const sel = { width:'100%', padding:'10px 12px', borderRadius:8,
    border:'1px solid #ddd', background:'#fff', fontSize:16, marginTop:4 }

  return (
    <div>
      <div style={{ background:'#8B4513', padding:'20px 16px 16px', color:'#fff' }}>
        <h1 style={{ fontSize:20, fontWeight:600, marginBottom:12 }}>
          Numismática Española
        </h1>
        <input
          placeholder="Buscar por texto libre..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          style={{ ...sel, background:'rgba(255,255,255,0.15)',
            color:'#fff', border:'1px solid rgba(255,255,255,0.3)' }}
        />
      </div>

      <div style={{ padding:'12px 16px', background:'#fff', borderBottom:'1px solid #eee' }}>
        <div style={{ marginBottom:10 }}>
          <label style={{ fontSize:12, color:'#888', fontWeight:600 }}>ERA HISTÓRICA</label>
          <select value={era} onChange={e => { setEra(e.target.value); setDenom(''); setCeca('') }} style={sel}>
            <option value="">Todas las eras</option>
            {eras.filter(Boolean).map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <label style={{ fontSize:12, color:'#888', fontWeight:600 }}>DENOMINACIÓN</label>
            <select value={denom} onChange={e => { setDenom(e.target.value); setCeca('') }} style={sel}>
              <option value="">Todas</option>
              {denoms.filter(Boolean).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#888', fontWeight:600 }}>CECA</label>
            <select value={ceca} onChange={e => setCeca(e.target.value)} style={sel}>
              <option value="">Todas</option>
              {cecas.filter(Boolean).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding:'10px 16px 4px' }}>
        <p style={{ fontSize:13, color:'#888' }}>
          {resultados.length} moneda{resultados.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ padding:'0 16px' }}>
        {resultados.slice(0, 100).map(coin => (
          <div
            key={coin.id + coin.era}
            onClick={() => nav(`/moneda/${encodeURIComponent(coin.id + '|' + coin.era)}`)}
            style={{
              display:'flex', gap:12, padding:'12px 0',
              borderBottom:'1px solid #f0f0f0', cursor:'pointer',
            }}
          >
            {coin.imagen
              ? <img src={IMG_URL(coin.imagen)} alt=""
                  style={{ width:80, height:40, objectFit:'contain',
                    background:'#f9f9f9', borderRadius:6, flexShrink:0 }} />
              : <div style={{ width:80, height:40, background:'#f0ede8',
                  borderRadius:6, flexShrink:0, display:'flex',
                  alignItems:'center', justifyContent:'center',
                  fontSize:11, color:'#bbb' }}>sin foto</div>
            }
            <div style={{ minWidth:0 }}>
              <p style={{ fontWeight:600, fontSize:15, color:'#1a1a1a' }}>
                {coin.denominacion}
                <span style={{ fontSize:12, color:'#8B4513', marginLeft:6,
                  fontWeight:400 }}>T{coin.tipo}</span>
              </p>
              <p style={{ fontSize:13, color:'#555', marginTop:2 }}>
                {coin.era} · {coin.ceca}
              </p>
              {coin.descripcion && (
                <p style={{ fontSize:12, color:'#888', marginTop:2,
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {coin.descripcion}
                </p>
              )}
            </div>
            <div style={{ marginLeft:'auto', flexShrink:0, textAlign:'right' }}>
              {coin.precio === 'RRR'
                ? <span style={{ background:'#8B4513', color:'#fff',
                    fontSize:11, padding:'2px 6px', borderRadius:4 }}>RRR</span>
                : coin.precio
                  ? <span style={{ fontSize:14, fontWeight:600, color:'#2a6e2a' }}>
                      {coin.precio.toLocaleString('es-ES')}€
                    </span>
                  : null
              }
            </div>
          </div>
        ))}
        {resultados.length > 100 && (
          <p style={{ textAlign:'center', padding:'16px 0', color:'#888', fontSize:14 }}>
            Mostrando 100 de {resultados.length}. Usa los filtros para afinar.
          </p>
        )}
      </div>
    </div>
  )
}
