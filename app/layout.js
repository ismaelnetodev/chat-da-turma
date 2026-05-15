import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Chat da Turma',
  description: 'Plataforma de comunicação da turma de Engenharia de Software',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Cabeçalho global de navegação */}
        <Header />

        {/* Conteúdo da página ativa */}
        {children}
      </body>
    </html>
  )
}
