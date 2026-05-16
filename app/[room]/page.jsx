'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { getCurrentUser } from '../../lib/auth'
import { getCurrentProfile } from '../../lib/profile'

export default function ChatRoom() {
  const { room } = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const [userId, setUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  // Pega o nome do usuário autenticado ou o nome salvo. Se não existir, redireciona.
  useEffect(() => {
    let mounted = true

    async function loadName() {
      if (!supabase) {
        if (mounted) setLoading(false)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const currentUser = session?.user ?? null
      if (currentUser) {
        const { profile } = await getCurrentProfile()
        if (!mounted) return
        setName(profile?.name || currentUser.email || '')
        setUserId(currentUser.id)
        setLoading(false)
        return
      }

      const saved = sessionStorage.getItem('chat_name')
      if (saved) {
        if (!mounted) return
        setName(saved)
        setUserId(null)
        setLoading(false)
        return
      }

      if (mounted) {
        setLoading(false)
        router.push('/')
      }
    }

    loadName()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUserId(session.user.id)
        getCurrentProfile().then(({ profile }) => {
          if (!mounted) return
          setName(profile?.name || session.user.email || '')
        })
      } else {
        setUserId(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  // Carrega mensagens iniciais + inscreve no Realtime
  useEffect(() => {
    if (!name) return

    if (!supabase) {
      setError('configure')
      setLoading(false)
      return
    }

    // Carrega histórico
    supabase
      .from('messages')
      .select()
      .eq('room', room)
      .order('created_at')
      .limit(50)
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setMessages(data || [])
        setLoading(false)
      })

    // Realtime: sem filtro server-side, filtra no cliente
    const channel = supabase
      .channel('messages-' + room)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.room === room) {
            setMessages(prev => {
              // evita duplicar mensagem otimista
              const alreadyExists = prev.some(m => m.id === payload.new.id)
              if (alreadyExists) return prev
              return [...prev, payload.new]
            })
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [name, room])

  // Auto-scroll ao receber mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || !supabase) return

    const content = input.trim()
    setInput('')

    // Update otimista: aparece na hora para quem enviou
    const tempId = 'temp-' + Date.now()
    setMessages(prev => [...prev, { id: tempId, room, name, content, created_at: new Date().toISOString() }])

    const insertPayload = { room, name, content }
    if (userId) insertPayload.user_id = userId

    const { data, error: err } = await supabase
      .from('messages')
      .insert(insertPayload)
      .select()
      .single()

    if (err) {
      // Remove a mensagem otimista se falhou
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setError(err.message)
      return
    }

    // Troca o tempId pelo id real
    setMessages(prev => prev.map(m => m.id === tempId ? data : m))
  }

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <button className="back-btn" onClick={() => router.push('/')}>←</button>
        <div>
          <span className="room-label">#{room}</span>
          <span className="you-label">Você: {name}</span>
        </div>
      </header>

      <div className="messages">
        {loading && <div className="status-msg">Conectando...</div>}

        {error === 'configure' && (
          <div className="status-msg error">
            <strong>Supabase não configurado.</strong><br />
            Adicione as variáveis <code>NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no Vercel e faça redeploy.
          </div>
        )}

        {error && error !== 'configure' && (
          <div className="status-msg error">Erro ao conectar: {error}</div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="status-msg">Nenhuma mensagem ainda. Seja o primeiro! 👋</div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.name === name ? 'mine' : 'theirs'}`}>
            {msg.name !== name && <span className="msg-name">{msg.name}</span>}
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder={error ? 'Configure o Supabase para enviar mensagens' : 'Digite uma mensagem...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={500}
          disabled={!!error}
          autoFocus
        />
        <button type="submit" disabled={!!error}>Enviar</button>
      </form>
    </div>
  )
}
