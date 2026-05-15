'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, Typography, Spin } from 'antd'

import {
  getCurrentProfile,
  updateProfileBio,
  uploadAvatar,
} from '@/lib/profile'
import { getCurrentUser } from '@/lib/auth'
import ProfileCard from '@/components/ProfileCard'

const { Text } = Typography

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f2f3f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '40px 16px',
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  fullCenter: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f2f3f5',
    gap: 16,
  },
  alertWrapper: {
    maxWidth: 480,
    width: '100%',
    padding: '0 16px',
  },
}

export default function PerfilPage() {
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [email, setEmail] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [error, setError] = useState(null)

  // 1. Verify auth — redirect to /auth/login if not authenticated
  useEffect(() => {
    async function checkAuth() {
      const { user, error: authError } = await getCurrentUser()

      if (authError || !user) {
        router.replace('/auth/login')
        return
      }

      setEmail(user.email ?? '')
      setAuthChecked(true)
    }

    checkAuth()
  }, [router])

  // 2. Fetch profile only after auth is confirmed
  const loadProfile = useCallback(async () => {
    setPageLoading(true)
    setError(null)

    const { profile: data, error: fetchError } = await getCurrentProfile()

    if (fetchError) {
      setError(
        typeof fetchError === 'string'
          ? fetchError
          : fetchError?.message ?? 'Erro ao carregar perfil.'
      )
    } else {
      setProfile(data)
    }

    setPageLoading(false)
  }, [])

  useEffect(() => {
    if (authChecked) loadProfile()
  }, [authChecked, loadProfile])

  // 3. Handlers passed to ProfileCard

  const handleSaveBio = async (newBio) => {
    const { profile: updated, error: updateError } = await updateProfileBio(newBio)

    if (updateError) {
      throw new Error(
        typeof updateError === 'string'
          ? updateError
          : updateError?.message ?? 'Erro ao salvar bio.'
      )
    }

    setProfile(updated)
  }

  const handleUploadAvatar = async (file) => {
    const { profile: updated, error: uploadError } = await uploadAvatar(file)

    if (uploadError) {
      throw new Error(
        typeof uploadError === 'string'
          ? uploadError
          : uploadError?.message ?? 'Erro ao enviar foto.'
      )
    }

    setProfile(updated)
  }

  // — Auth not yet resolved: show spinner
  if (!authChecked) {
    return (
      <div style={styles.fullCenter}>
        <Spin size="large" />
        <Text type="secondary">Verificando sessão...</Text>
      </div>
    )
  }

  return (
    <main style={styles.page}>
      <Typography.Title level={4} style={styles.heading}>
        Meu Perfil
      </Typography.Title>

      {error && (
        <div style={{ ...styles.alertWrapper, marginBottom: 16 }}>
          <Alert
            type="error"
            showIcon
            message="Não foi possível carregar o perfil"
            description={error}
            style={{ borderRadius: 12 }}
          />
        </div>
      )}

      <ProfileCard
        loading={pageLoading}
        nome={profile?.name ?? ''}
        usuario={profile?.username ?? ''}
        email={email}
        bio={profile?.bio ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
        onSaveBio={handleSaveBio}
        onUploadAvatar={handleUploadAvatar}
      />
    </main>
  )
}
