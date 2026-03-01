'use client'

import Link from 'next/link'
import { Leaf, Brain, Heart, MapPin, Mail, Phone, MessageCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #eef5e0, #e0edc8)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(106,170,79,0.12)', color: 'var(--primary)',
          padding: '0.5rem 1rem', borderRadius: '999px',
          fontSize: '0.85rem', fontWeight: '600',
          marginBottom: '1.25rem',
          border: '1px solid rgba(106,170,79,0.2)'
        }}>
          <Heart size={14} />
          Made with care for Kerala
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
          About AgriKerala
        </h1>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.05rem',
          maxWidth: '560px', margin: '0 auto', lineHeight: '1.8'
        }}>
          We believe every Kerala home deserves a thriving rooftop garden.
          AgriKerala was built to make that possible for everyone.
        </p>
      </div>

      {/* Mission */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }} className="about-grid">

            <div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: '1.5rem' }}>
                Our Mission
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '1rem', marginBottom: '1.25rem' }}>
                Kerala has one of the richest agricultural traditions in India. Yet in today&apos;s urban landscape, most families have lost touch with growing their own food. We built AgriKerala to bridge that gap.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '1rem', marginBottom: '1.25rem' }}>
                Our AI planner removes the guesswork from rooftop farming. By analysing your specific location in Kerala, your rooftop dimensions and your available time, we give you a farming plan that actually works for your life.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '1rem' }}>
                Every product in our store is selected specifically for Kerala&apos;s climate. From Kanthari chilli seeds to dwarf banana plants — we stock what actually grows well on Kerala rooftops.
              </p>
            </div>

            {/* Values */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                {
                  icon: Leaf,
                  title: 'Kerala First',
                  desc: 'Every recommendation, every product, every care guide is built specifically for Kerala\'s unique climate and culture.'
                },
                {
                  icon: Brain,
                  title: 'AI Powered',
                  desc: 'We use cutting-edge AI to give each person a personalized farming plan, not generic advice.'
                },
                {
                  icon: Heart,
                  title: 'Community Driven',
                  desc: 'We are building a community of rooftop farmers across Kerala who share knowledge and grow together.'
                },
                {
                  icon: MapPin,
                  title: 'Local Roots',
                  desc: 'Based in Kerala, we understand the local challenges, seasons and the love for fresh homegrown food.'
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  display: 'flex', gap: '1rem',
                  padding: '1.25rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px'
                }}>
                  <div style={{
                    width: '42px', height: '42px', flexShrink: 0,
                    background: 'rgba(106,170,79,0.1)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      {/* Contact */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: '1rem' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '460px', margin: '0 auto' }}>
              Have questions about rooftop farming or our products? We are here to help.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { icon: Phone, title: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: Mail, title: 'Email Us', value: 'hello@agrikerala.in', href: 'mailto:hello@agrikerala.in' },
              { icon: MessageCircle, title: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/919876543210' },
              { icon: MapPin, title: 'Location', value: 'Kochi, Kerala', href: '#' },
            ].map(({ icon: Icon, title, value, href }) => (
              <a key={title} href={href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(106,170,79,0.1)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Icon size={22} color="var(--primary)" />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{title}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, var(--primary), var(--olive))',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'white', marginBottom: '1rem' }}>
            Start Growing Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '460px', margin: '0 auto 2.5rem' }}>
            Use our free AI planner to get a personalized farming plan for your Kerala rooftop.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planner" style={{
              background: 'white', color: 'var(--primary)',
              padding: '1rem 2.5rem', borderRadius: '999px',
              fontWeight: '700', fontSize: '1rem',
              textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }}>
              <Brain size={18} />
              Try AI Planner Free
            </Link>
            <Link href="/shop" style={{
              background: 'transparent', color: 'white',
              padding: '1rem 2.5rem', borderRadius: '999px',
              fontWeight: '700', fontSize: '1rem',
              textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: '0.5rem',
              border: '2px solid rgba(255,255,255,0.6)'
            }}>
              <Leaf size={18} />
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}