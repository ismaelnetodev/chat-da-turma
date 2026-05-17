'use client'

import {useState} from 'react'
import { useRouter } from 'next/navigation'
import {Input, Button, Alert} from 'antd'
import { createPost } from '@/lib/posts'
import { getCurrentUser } from '@/lib/auth'

export default function PostForm() {

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    async function handleSubmit() {
        setErrorMessage('')
        if (!content.trim()) {
            setErrorMessage('O post não pode estar vazio')
            return
        }

        setLoading(true)
        
        try {
            const {user} = await getCurrentUser()

            if (!user) {
                router.push('/auth/login')
                return
            }

            const {error} = await createPost(content, user.id)

            if (error) {
                setErrorMessage(error.message || 'Erro ao publicar post')
                return
            }

            router.push('/')
        } catch (error) {
            setErrorMessage('Erro inesperado')
        } finally {
            setLoading(false)
        }

    }

    return (
       <div
        style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '40px',
            paddingLeft: '16px',
            paddingRight: '16px'
        }}
    >
        <div
            style={{
                width: '100%',
                maxWidth: '700px',
                background: '#fff',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
            }}
        >
            <h1 style={{ marginBottom: '20px' }}>
                Novo Post
            </h1>

            <Input.TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Digite seu post...'
                maxLength={280}
                rows={4}
            />

            <p
                style={{
                    marginTop: '8px',
                    marginBottom: '16px',
                    color: '#666'
                }}
            >
                {content.length}/280
            </p>

            {errorMessage && (
                <Alert
                    title={errorMessage}
                    type='error'
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}

            <Button
                type='primary'
                onClick={handleSubmit}
                loading={loading}
                block
            >
                Publicar
            </Button>
        </div>
    </div>
    )
}
