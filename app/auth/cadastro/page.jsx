'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Form, Input, Typography, Alert } from 'antd'
import { signUpUser } from '@/lib/auth'

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(values) {
    setLoading(true)
    setErrorMessage('')

    const { name, username, email, password } = values

    const { error } = await signUpUser({
      name,
      username,
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message || error)
      return
    }

    router.push('/perfil')
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2} className="auth-title">
          Criar conta
        </Typography.Title>

        <Typography.Text type="secondary" className="auth-subtitle">
          Cadastre-se para publicar posts na mini rede social.
        </Typography.Text>

        {errorMessage && (
          <Alert
            type="error"
            message="Erro ao criar conta"
            description={errorMessage}
            showIcon
            className="auth-alert"
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Nome"
            name="name"
            rules={[
              { required: true, message: 'Informe seu nome.' },
              { min: 3, message: 'O nome deve ter pelo menos 3 caracteres.' },
            ]}
          >
            <Input maxLength={60} />
          </Form.Item>

          <Form.Item
            label="Nome de usuário"
            name="username"
            rules={[
              { required: true, message: 'Informe seu nome de usuário.' },
              { min: 3, message: 'O usuário deve ter pelo menos 3 caracteres.' },
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Informe seu e-mail.' },
              { type: 'email', message: 'Informe um e-mail válido.' },
            ]}
          >
            <Input placeholder="seuemail@email.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: 'Informe sua senha.' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres.' },
            ]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            shape="round"
            size="large"
            loading={loading}
          >
            Criar conta
          </Button>
        </Form>

        <Typography.Paragraph className="auth-footer">
          Já tem uma conta? <Link href="/auth/login">Entrar</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  )
}