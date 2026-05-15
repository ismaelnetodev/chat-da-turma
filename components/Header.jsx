'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, Button, Space, Typography } from 'antd'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOutUser } from '@/lib/auth'
import { getCurrentProfile } from '@/lib/profile'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadUser() {
      const { user } = await getCurrentUser()
      setUser(user)

      if (user) {
        const { profile } = await getCurrentProfile()
        setProfile(profile)
      }

      setLoading(false)
    }

    loadUser()

    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await signOutUser()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <header className="app-header">
      <Link href="/" className="header-user">
        <Avatar src={profile?.avatar_url || '/avatar.jpg'} size={40} />

        <div>
          <Typography.Text strong className="header-name">
            {profile?.name || 'Mini Rede'}
          </Typography.Text>

          <Typography.Text className="header-handle">
            {profile?.username ? `@${profile.username}` : user?.email || '@turma'}
          </Typography.Text>
        </div>
      </Link>

      <nav className="header-nav">
        <Link href="/">Feed</Link>

        {!loading && user && (
          <>
            <Link href="/perfil">Perfil</Link>
            <Link href="/post/novo">Novo post</Link>

            <Button shape="round" onClick={handleLogout}>
              Sair
            </Button>
          </>
        )}

        {!loading && !user && (
          <Space size={8}>
            <Link href="/auth/login">
              <Button shape="round">Entrar</Button>
            </Link>

            <Link href="/auth/cadastro">
              <Button type="primary" shape="round">
                Criar conta
              </Button>
            </Link>
          </Space>
        )}
      </nav>
    </header>
  )
}