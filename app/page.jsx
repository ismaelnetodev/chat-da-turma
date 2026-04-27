'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const sala = room.trim() || 'geral'
    sessionStorage.setItem('chat_name', name.trim())
    router.push(`/${sala}`)
  }

  return (
    <main className="landing">
      <div className="blob" />

      <div className="landing-text">
        <span className="badge">Acesso instantâneo</span>
        <h1>Chat da turma<br />sem complicação.</h1>
        <p>Digite seu nome, escolha um código de sala e comece a conversar agora mesmo.</p>
        <p className="hint">💬 Seja respeitoso. Sem spam.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        <p className="card-sub">Se você veio por link de convite, o código já foi preenchido.</p>

        <label>
          Seu nome
          <input
            type="text"
            placeholder="Ex: João Silva"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={32}
            required
          />
        </label>

        <label>
          Código da sala <span className="optional">(opcional)</span>
          <div className="input-prefix">
            <span>#</span>
            <input
              type="text"
              placeholder="Ex: TURMA01"
              value={room}
              onChange={e => setRoom(e.target.value.toUpperCase())}
              maxLength={20}
            />
          </div>
        </label>

        <button type="submit">Entrar →</button>
      </form>
    </main>
  )
}
