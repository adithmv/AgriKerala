import './globals.css'

export const metadata = {
  title: 'AgriKerala — Grow Your Rooftop',
  description: 'Kerala\'s first AI-powered rooftop farming assistant and agricultural products store.',
  keywords: 'kerala farming, rooftop garden, seeds kerala, plants kerala, AI farming planner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}