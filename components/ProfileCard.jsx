'use client'

import { useState, useRef } from 'react'
import {
  Card,
  Typography,
  Avatar,
  Space,
  Button,
  Input,
  message,
  Divider,
  Spin,
} from 'antd'
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CameraOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const styles = {
  card: {
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    maxWidth: 480,
    width: '100%',
    margin: '0 auto',
  },
  cardBody: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  },
  avatarWrapper: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    marginBottom: 20,
  },
  avatarOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  cameraIcon: {
    color: '#fff',
    fontSize: 20,
  },
  hiddenInput: {
    display: 'none',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 2,
    textAlign: 'center',
  },
  username: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    margin: '20px 0',
    borderColor: '#e5e7eb',
    width: '100%',
  },
  bioSection: {
    width: '100%',
    textAlign: 'left',
  },
  bioLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
    display: 'block',
  },
  bioText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.6,
    margin: 0,
  },
  bioPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  editButton: {
    color: '#0a9e7a',
    fontSize: 13,
    padding: 0,
    height: 'auto',
  },
  bioHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  actionRow: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
    width: '100%',
    justifyContent: 'flex-end',
  },
  uploadingOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

/**
 * ProfileCard
 *
 * Props:
 *  - nome        {string}   Nome completo do usuário
 *  - usuario     {string}   Handle/username
 *  - email       {string}   E-mail do usuário
 *  - bio         {string}   Bio atual (pode ser null/undefined)
 *  - avatarUrl   {string}   URL pública do avatar (pode ser null/undefined)
 *  - onSaveBio   {function} async (bio: string) => void — chamada ao salvar bio
 *  - onUploadAvatar {function} async (file: File) => void — chamada ao selecionar foto
 *  - loading     {boolean}  Exibe skeleton/spin enquanto carrega dados iniciais
 */
export default function ProfileCard({
  nome = '',
  usuario = '',
  email = '',
  bio = '',
  avatarUrl = null,
  onSaveBio,
  onUploadAvatar,
  loading = false,
}) {
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState(bio)
  const [savingBio, setSavingBio] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [hoveringAvatar, setHoveringAvatar] = useState(false)
  const fileInputRef = useRef(null)

  const initial = nome?.charAt(0)?.toUpperCase() || '?'

  const handleEditBio = () => {
    setBioValue(bio)
    setEditingBio(true)
  }

  const handleCancelBio = () => {
    setBioValue(bio)
    setEditingBio(false)
  }

  const handleSaveBio = async () => {
    if (!onSaveBio) return
    setSavingBio(true)
    try {
      await onSaveBio(bioValue)
      message.success('Bio atualizada!')
      setEditingBio(false)
    } catch {
      message.error('Não foi possível salvar a bio.')
    } finally {
      setSavingBio(false)
    }
  }

  const handleAvatarClick = () => {
    if (!uploadingAvatar) fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !onUploadAvatar) return
    setUploadingAvatar(true)
    try {
      await onUploadAvatar(file)
      message.success('Foto de perfil atualizada!')
    } catch {
      message.error('Não foi possível fazer upload da foto.')
    } finally {
      setUploadingAvatar(false)
      // Reset input so same file can be re-selected
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <Card style={styles.card} styles={{ body: styles.cardBody }}>
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <Spin size="large" />
          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Carregando perfil...
          </Text>
        </div>
      </Card>
    )
  }

  return (
    <Card style={styles.card} styles={{ body: styles.cardBody }}>
      {/* Avatar */}
      <div
        style={styles.avatarWrapper}
        onClick={handleAvatarClick}
        onMouseEnter={() => setHoveringAvatar(true)}
        onMouseLeave={() => setHoveringAvatar(false)}
        role="button"
        aria-label="Alterar foto de perfil"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleAvatarClick()}
      >
        {avatarUrl ? (
          <Avatar
            size={96}
            src={avatarUrl}
            alt={`Foto de perfil de ${nome}`}
            style={{ display: 'block' }}
          />
        ) : (
          <Avatar
            size={96}
            style={{
              background: '#0a9e7a',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initial}
          </Avatar>
        )}

        {/* Hover overlay */}
        {!uploadingAvatar && (
          <div
            style={{
              ...styles.avatarOverlay,
              opacity: hoveringAvatar ? 1 : 0,
            }}
            aria-hidden="true"
          >
            <CameraOutlined style={styles.cameraIcon} />
          </div>
        )}

        {/* Upload spinner overlay */}
        {uploadingAvatar && (
          <div style={styles.uploadingOverlay} aria-label="Enviando foto...">
            <Spin size="small" style={{ color: '#fff' }} />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Name + username + email */}
      <Title level={3} style={styles.name}>
        {nome || <Text type="secondary">Sem nome</Text>}
      </Title>

      <Text style={styles.username}>@{usuario}</Text>

      <Space size={4} style={{ marginTop: 4, marginBottom: 0 }}>
        <MailOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
        <Text style={styles.email}>{email}</Text>
      </Space>

      <Divider style={styles.divider} />

      {/* Bio section */}
      <div style={styles.bioSection}>
        <div style={styles.bioHeader}>
          <Text style={styles.bioLabel}>Bio</Text>
          {!editingBio && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              style={styles.editButton}
              onClick={handleEditBio}
              aria-label="Editar bio"
            >
              Editar
            </Button>
          )}
        </div>

        {editingBio ? (
          <>
            <Input.TextArea
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              placeholder="Escreva algo sobre você..."
              maxLength={200}
              showCount
              autoSize={{ minRows: 3, maxRows: 5 }}
              autoFocus
              style={{
                borderRadius: 8,
                borderColor: '#0a9e7a',
                fontSize: 14,
                color: '#374151',
                resize: 'none',
              }}
            />
            <div style={styles.actionRow}>
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={handleCancelBio}
                disabled={savingBio}
              >
                Cancelar
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSaveBio}
                loading={savingBio}
              >
                Salvar
              </Button>
            </div>
          </>
        ) : bio ? (
          <Paragraph style={styles.bioText}>{bio}</Paragraph>
        ) : (
          <Text style={styles.bioPlaceholder}>
            Nenhuma bio ainda. Clique em &quot;Editar&quot; para adicionar.
          </Text>
        )}
      </div>
    </Card>
  )
}
