'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, Menu, X, Sprout } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 20px rgba(106,170,79,0.08)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem'
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sprout size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            Agri<span style={{ color: 'var(--primary)' }}>Kerala</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }} className="desktop-nav">
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Home
          </Link>
          <Link href="/shop" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Shop
          </Link>
          <Link href="/planner" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            AI Planner
          </Link>
          <Link href="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            About
          </Link>
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/planner" className="btn-primary" style={{
            fontSize: '0.85rem',
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Leaf size={15} />
            Try AI Planner
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              color: 'var(--text-primary)'
            }}
            className="hamburger"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/shop" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/planner" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>AI Planner</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }} onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}