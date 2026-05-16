'use client'

import {useState} from 'react'
import { useRouter } from 'next/navigation'
import {Input, Button} from '/antd'
import { createPost } from '@/lib/posts'
import { getCurrentUser } from '@/lib/auth'

export default function PostForm() {

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    async function handleSubmit() {
        if (!content.trim()) {
            setErrorMessage('O post não pode estar vazio')
            return
        }

        setLoading(true)
        // console.log(content)
        try {
            const {user} = await getCurrentUser()

            if (!user) {
                router.push('/auth/login')
                return
            }

            const {error} = await createPost({content, userId: user.id})

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

            {errorMessage && (<p>{errorMessage}</p>)}

            <button type='primary' onClick={handleSubmit} loading={loading}>Publicar</button>
        </div>
    )
}