'use client'

import { Typography, Empty, Space } from "antd"
import { PostCard } from "@/components/PostCard"
// import { posts } from "@/data/Post"


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
}

export function Feed() {
  // const hasPosts = posts.length > 0
  const hasPosts = 0

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

      {hasPosts ? (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              autor={post.autor}
              conteudo={post.conteudo}
              data={post.data}
            />
          ))}
        </Space>
      ) : (
        <Empty description="Nenhum post publicado ainda..."/>
      )}
    </main>
  )
}