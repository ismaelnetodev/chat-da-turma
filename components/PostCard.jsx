'use client'

import { Avatar, Button, Card, Space, Typography } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

function getInitials(name) {
  if (!name) return '?'

  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

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
    background: '#0a9e7a',
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
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 14,
    color: '#111827',
  },
  username: {
    fontSize: 13,
    color: '#6b7280',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  text: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.65,
    marginBottom: 12,
    wordBreak: 'break-word',
  },
  actions: {
    marginTop: 4,
  },
  likeButton: {
    padding: 0,
    height: 'auto',
    color: '#0a9e7a',
  },
}

export function PostCard({ post, onLike }) {
  const author = post?.author || {}
  const authorName = author.name || 'Usuário'
  const username = author.username || 'usuario'
  const likesCount = post?.likesCount ?? 0

  return (
    <Card
      variant={false}
      style={styles.card}
      styles={{ body: styles.body }}
    >
      {author.avatarUrl ? (
        <Avatar
          size={42}
          src={author.avatarUrl}
          alt={`Foto de perfil de ${authorName}`}
          style={{ flexShrink: 0 }}
        />
      ) : (
        <Avatar size={42} style={styles.avatar}>
          {getInitials(authorName)}
        </Avatar>
      )}

      <div style={styles.content}>
        <div style={styles.meta}>
          <Text strong style={styles.author}>
            {authorName}
          </Text>

          <Text style={styles.username}>
            @{username}
          </Text>

          <Text style={styles.date}>
            · {formatDate(post?.createdAt)}
          </Text>
        </div>

        <Paragraph style={styles.text}>
          {post?.content}
        </Paragraph>

        <Space style={styles.actions}>
          <Button
            type="text"
            icon={post?.likedByMe ? <HeartFilled /> : <HeartOutlined />}
            onClick={onLike}
            style={styles.likeButton}
          >
            {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
          </Button>
        </Space>
      </div>
    </Card>
  )
}