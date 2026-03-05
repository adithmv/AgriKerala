import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'UrbanSprout — Grow Your Rooftop',
  description: 'Kerala\'s first AI-powered rooftop farming assistant and agricultural products store.',
  keywords: 'kerala farming, rooftop garden, seeds kerala, plants kerala, AI farming planner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%236aaa4f'/><path d='M16 24 C16 24 16 14 16 14' stroke='white' stroke-width='2' stroke-linecap='round'/><path d='M16 18 C16 18 12 15 10 11 C13 10 17 12 16 18' fill='white'/><path d='M16 16 C16 16 20 13 22 9 C19 8 15 10 16 16' fill='rgba(255,255,255,0.7)'/></svg>" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}