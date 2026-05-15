'use client'

import {useState} from 'react'

export default function PostForm() {

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (!content.trim()) {
            console.log('Post vazio')
            return
        }

        setLoading(true)
        // console.log(content)

        try {
            await new Promisse((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Digite seu post...' />

            <p>{content.length}/280</p>

            <button onClick={handleSubmit} disabled={loading}>Publicar</button>
        </div>
    )
}