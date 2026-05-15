'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Form, Input, Typography, Alert } from 'antd'
import { signInUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(values) {
    setLoading(true)
    setErrorMessage('')

    const { email, password } = values

    const { error } = await signInUser({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message || error)
      return
    }

    router.push('/')
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2} className="auth-title">
          Fazer login
        </Typography.Title>

        <Typography.Text type="secondary" className="auth-subtitle">
          Entre na sua conta para publicar posts.
        </Typography.Text>

        {errorMessage && (
          <Alert
            type="error"
            message="Erro ao fazer login"
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
            Entrar
          </Button>
        </Form>

        <Typography.Paragraph className="auth-footer">
          Ainda não tem uma conta?{' '}
          <Link href="/auth/cadastro">Cadastre-se</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  )
}