'use client'

import { Avatar, Card, Typography } from 'antd'

const { Text, Paragraph } = Typography

/** Gera as iniciais do nome para o avatar */
function getInitials(name) {
  if (!name) return 'AN'
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Formata a data para pt-BR — ex.: "12 de abr. de 2025" */
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const styles = {
  card: {
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    width: '100%',
  },
  body: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    padding: '18px 20px',
  },
  avatar: {
    background: '#0ea5e9',
    color: '#ffffff',
    fontWeight: 700,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 14,
    color: '#111827',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  text: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.65,
    marginBottom: 0,
    wordBreak: 'break-word',
  },
}

/**
 * PostCard — card reutilizável que exibe uma publicação da turma.
 *
 * Props:
 *   autor    {string}  Nome do autor do post
 *   conteudo {string}  Texto da publicação
 *   data     {string}  Data em formato ISO ou legível
 */
export function PostCard({ autor, conteudo, data }) {
  return (
    <Card
      variant={false}
      style={styles.card}
      styles={{ body: styles.body }}
    >
      {/* Avatar com iniciais do autor */}
      <Avatar size={42} style={styles.avatar}>
        {getInitials(autor)}
      </Avatar>

      {/* Conteúdo do post */}
      <div style={styles.content}>
        <div style={styles.meta}>
          <Text strong style={styles.author}>{autor}</Text>
          <Text style={styles.date}>{formatDate(data)}</Text>
        </div>
        <Paragraph style={styles.text}>{conteudo}</Paragraph>
      </div>
    </Card>
  )
}
