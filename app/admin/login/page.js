'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        setError('Invalid email or password.')
        return
      }

      // Check if email is in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      if (adminError || !adminData) {
        await supabase.auth.signOut()
        setError('You do not have admin access.')
        return
      }

      router.push('/admin/dashboard')

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fbf2 0%, #eef5e0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(106,170,79,0.1)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'var(--primary)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Sprout size={28} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: '700', marginBottom: '0.4rem'
          }}>
            Admin Login
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            AgriKerala Control Panel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '0.85rem 1rem',
            color: '#dc2626', fontSize: '0.88rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              fontSize: '0.82rem', fontWeight: '700',
              color: 'var(--text-secondary)', marginBottom: '0.5rem',
              display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-secondary)'
              }} />
              <input
                type="email"
                placeholder="admin@agrikerala.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              fontSize: '0.82rem', fontWeight: '700',
              color: 'var(--text-secondary)', marginBottom: '0.5rem',
              display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-secondary)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? 'var(--border)' : 'var(--primary)',
              color: loading ? 'var(--text-secondary)' : 'white',
              border: 'none', borderRadius: '999px',
              fontSize: '1rem', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.75rem'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--olive)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--primary)' }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}