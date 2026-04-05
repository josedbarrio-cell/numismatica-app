import { useParams, useNavigate } from 'react-router-dom'
import { IMG_URL } from '../config'

function Campo({ label, valor }) {
  if (!valor) return null
  return (
    <div style={{ padding:'12px 0', borderBottom:'1px solid #f0f0f0' }}>
      <p style={{ fontSize:12, color:'#888', fontWeight:600, marginBottom:3 }}>{label}</p>
      <p style={{ fontSize:15, color:'#1a1a1a' }}>{valor}</p>
    </div>
  )
}

export default function Detalle({ coins }) {
  const { id } = useParams()
  const nav = useNavigate()

  // id en la URL es "numeroRef|era" codificado
  const decoded = decodeURIComponent(id)
  const [refId, era] = decoded.split('|')
  const coin = coins.find(c => c.id === refId && c.era === era)

  if (!coin) return (
    <div style={{ padding:32, textAlign:'center' }}>
      <p style={{ color:'#888' }}>Moneda no encontrada</p>
      <button onClick={() => nav('/')} style={{ marginTop:16, color:'#8B4513' }}>
        ← Volver
      </button>
    </div>
  )

  return (
    <div>
      <div style={{ background:'#8B4513', padding:'16px', color:'#fff',
        display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => nav(-1)} style={{ color:'#fff', fontSize:22, lineHeight:1 }}>←</button>
        <div>
          <h1 style={{ fontSize:18, fontWeight:600 }}>{coin.denominacion}</h1>
          <p style={{ fontSize:13, opacity:0.8 }}>{coin.era}</p>
        </div>
      </div>

      {coin.imagen && (
        <div style={{ background:'#f9f6f0', padding:24, textAlign:'center' }}>
          <img
            src={IMG_URL(coin.imagen)}
            alt={`${coin.denominacion} ${coin.era}`}
            style={{ maxWidth:'100%', maxHeight:200, objectFit:'contain' }}
          />
        </div>
      )}

      <div style={{ padding:'0 16px', background:'#fff' }}>
        <div style={{ padding:'16px 0', borderBottom:'1px solid #f0f0f0',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#888', fontWeight:600 }}>PRECIO</span>
          {coin.precio === 'RRR'
            ? <span style={{ background:'#8B4513', color:'#fff',
                padding:'4px 10px', borderRadius:6, fontSize:13, fontWeight:600 }}>
                RRR — Rarísima
              </span>
            : coin.precio
              ? <span style={{ fontSize:22, fontWeight:700, color:'#2a6e2a' }}>
                  {coin.precio.toLocaleString('es-ES')} €
                </span>
              : <span style={{ color:'#aaa', fontSize:14 }}>Sin precio asignado</span>
          }
        </div>

        <Campo label="ERA HISTÓRICA"   valor={coin.era} />
        <Campo label="DENOMINACIÓN"    valor={coin.denominacion} />
        <Campo label="CECA"            valor={coin.ceca} />
        {coin.variante_ceca && (
          <Campo label="VARIANTE"      valor={coin.variante_ceca} />
        )}
        <Campo label="TIPO"            valor={`Tipo ${coin.tipo}`} />
        <Campo label="MATERIAL / PESO" valor={coin.tipo_desc} />
        <Campo label="DESCRIPCIÓN"     valor={coin.descripcion} />

        <div style={{ padding:'12px 0' }}>
          <p style={{ fontSize:11, color:'#bbb' }}>Ref. catálogo: #{coin.id}</p>
        </div>
      </div>
    </div>
  )
}
