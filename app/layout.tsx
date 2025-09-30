import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Especialistas em Recuperação e Planejamento Tributário | Advocacia Tributária',
  description: 'Pare de financiar o governo. Recupere o dinheiro que é seu. Especialistas em direito tributário com mais de 15 anos de experiência.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}