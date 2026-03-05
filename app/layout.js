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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%236aaa4f'/><svg x='7' y='7' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 9.536V7a4 0 0 1-4-4h1.5a5.5 5.5 0 0 1 .5 5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3'/><path d='M4 9a5 0 0 1 8 4 5 5 0 0 1-8-4'/><path d='M5 21h14'/></svg></svg>" />
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