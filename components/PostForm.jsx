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
        <div>
            <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Digite seu post...' maxLength={280} rows={4}/>

            <p>{content.length}/280</p>

            {errorMessage && (<Alert title={errorMessage} type='error' showIcon/>)}

            <Button type='primary' onClick={handleSubmit} loading={loading}>Publicar</Button>
        </div>
    )
}