'use client'

import { useEffect, useState } from "react"
import { Typography, Empty, Space, Spin, Alert } from "antd"
import { PostCard } from "@/components/PostCard"
import { getPosts, toggleLike } from "@/lib/posts"

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 4,
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
  },
  center: {
    textAlign: 'center',
    padding: '40px 0',
  },
}

export function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadPosts() {
    setLoading(true)
    setErrorMessage('')

    const { posts: loadedPosts, error } = await getPosts()

    if (error) {
      setErrorMessage(error.message || error)
    } else {
      setPosts(loadedPosts)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleLike(postId) {
    const { error } = await toggleLike(postId)

    if (error) {
      setErrorMessage(error.message || error)
      return
    }

    await loadPosts()
  }

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <Typography.Title level={2} style={styles.title}>
          Feed
        </Typography.Title>

        <Typography.Text style={styles.subtitle}>
          Veja as publicações mais recentes da turma.
        </Typography.Text>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          showIcon
          message="Erro ao carregar feed"
          description={errorMessage}
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      {loading ? (
        <div style={styles.center}>
          <Spin size="large" />
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Carregando posts...
          </Typography.Text>
        </div>
      ) : posts.length > 0 ? (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </Space>
      ) : (
        <Empty description="Nenhum post publicado ainda..." />
      )}
    </main>
  )
}