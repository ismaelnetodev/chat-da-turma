import './globals.css'

export const metadata = {
  title: 'Chat da Turma',
  description: 'Entre no chat em tempo real da sua turma',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
