'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button, Typography } from 'antd'

const { Text } = Typography

const NAV_ITEMS = [
  { label: 'Feed',        path: '/' },
  { label: '+ Publicar', path: '/post/novo' },
  { label: 'Perfil',     path: '/perfil' },
]

const styles = {
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  logo: {
    fontSize: 17,
    cursor: 'pointer',
    userSelect: 'none',
    color: '#111827',
    letterSpacing: '-0.3px',
    flexShrink: 0,
  },
  logoHighlight: {
    color: '#0ea5e9',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  activeBtn: {
    background: '#0ea5e9',
    borderColor: '#0ea5e9',
    borderRadius: 8,
    fontWeight: 600,
  },
  navBtn: {
    color: '#374151',
    borderRadius: 8,
  },
}

export function Header() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <header style={styles.wrapper}>
      <div style={styles.inner}>

        {/* Logo / título do app */}
        <Text
          strong
          style={styles.logo}
          onClick={() => router.push('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/')}
        >
          💬 <span style={styles.logoHighlight}>Chat</span> da Turma
        </Text>

        {/* Links de navegação */}
        <nav style={styles.nav} aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path
            return (
              <Button
                key={item.path}
                type={isActive ? 'primary' : 'text'}
                onClick={() => router.push(item.path)}
                style={isActive ? styles.activeBtn : styles.navBtn}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Button>
            )
          })}
        </nav>

      </div>
    </header>
  )
}
