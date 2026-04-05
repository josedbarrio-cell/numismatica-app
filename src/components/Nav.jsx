import { useLocation, useNavigate } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const nav = useNavigate()

  const items = [
    { path: '/',           label: 'Buscar',      icon: '⊞' },
    { path: '/identificar', label: 'Identificar', icon: '◎' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #e0e0e0',
      display: 'flex', justifyContent: 'center', gap: 0,
      zIndex: 100,
    }}>
      {items.map(item => {
        const active = pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => nav(item.path)}
            style={{
              flex: 1, maxWidth: 200,
              padding: '12px 0 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: active ? '#8B4513' : '#888',
              borderTop: active ? '2px solid #8B4513' : '2px solid transparent',
              fontSize: 11, fontWeight: active ? 600 : 400,
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
