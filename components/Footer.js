'use client'

import Link from 'next/link'
import { Sprout, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'



export default function Footer() {
  return (
    <footer style={{
      background: 'var(--text-primary)',
      color: 'rgba(255,255,255,0.8)',
      padding: '4rem 1.5rem 2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'var(--primary)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sprout size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: '700', color: 'white' }}>
                Urban<span style={{ color: 'var(--accent)' }}>Kerala</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.6)' }}>
              Kerala&apos;s first AI-powered rooftop farming assistant. Grow fresh, grow smart.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'AI Planner', href: '/planner' },
                { label: 'About Us', href: '/about' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Vegetable Seeds', 'Fruit Plants', 'Herbs & Spices', 'Fertilizers', 'Grow Bags & Tools'].map(cat => (
                <Link key={cat} href="/shop" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.2rem', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@UrbanSprout.in' },
                { Icon: MapPin, text: 'Kochi, Kerala, India' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={15} color="var(--accent)" />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2024 UrbanSprout. All rights reserved.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            Made with care for Kerala farmers
          </p>
        </div>
      </div>
    </footer>
  )
}