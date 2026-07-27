'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { Sprout, Mail, Phone, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function CustomerLogin() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [method, setMethod] = useState('email') // 'email' | 'phone'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  function resetMessages() {
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    resetMessages()
    setLoading(true)

    try {
      if (mode === 'signup') {
        await handleSignup()
      } else {
        await handleLogin()
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup() {
    if (!fullName.trim()) throw new Error('Please enter your name.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters.')

    let signupEmail
    let phoneToStore = ''

    if (method === 'email') {
      if (!email.trim()) throw new Error('Please enter your email.')
      signupEmail = email.trim()
    } else {
      if (!phone.trim()) throw new Error('Please enter your mobile number.')
      phoneToStore = phone.trim()
      // Supabase Auth needs an email internally; we generate one from the phone
      // number behind the scenes so people can sign up/login with just phone + password.
      signupEmail = `${phoneToStore}@agrikerala.local`
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: signupEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phoneToStore
        }
      }
    })

    if (signupError) {
      if (signupError.message.toLowerCase().includes('already registered')) {
        throw new Error('An account already exists with that ' + (method === 'email' ? 'email' : 'mobile number') + '.')
      }
      throw new Error(signupError.message)
    }

    router.push('/')
    router.refresh()
  }

  async function handleLogin() {
    let loginEmail

    if (method === 'email') {
      if (!email.trim()) throw new Error('Please enter your email.')
      loginEmail = email.trim()
    } else {
      if (!phone.trim()) throw new Error('Please enter your mobile number.')
      const { data: foundEmail, error: lookupError } = await supabase.rpc('get_email_by_phone', {
        phone_input: phone.trim()
      })
      if (lookupError || !foundEmail) {
        throw new Error('No account found with that mobile number.')
      }
      loginEmail = foundEmail
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password
    })

    if (loginError) {
      throw new Error('Incorrect password or account not found.')
    }

    router.push('/')
    router.refresh()
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none'
  }

  const tabStyle = (active) => ({
    flex: 1,
    textAlign: 'center',
    padding: '0.7rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.88rem',
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? 'white' : 'var(--text-secondary)',
    transition: 'all 0.2s'
  })

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
        maxWidth: '440px',
        boxShadow: '0 20px 60px rgba(106,170,79,0.1)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
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
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Log in to continue shopping' : 'Sign up to start shopping'}
          </p>
        </div>

        {/* Login / Signup toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg)', padding: '0.35rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={tabStyle(mode === 'login')} onClick={() => { setMode('login'); resetMessages() }}>Log In</div>
          <div style={tabStyle(mode === 'signup')} onClick={() => { setMode('signup'); resetMessages() }}>Sign Up</div>
        </div>

        {/* Email / Phone method toggle */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="radio" checked={method === 'email'} onChange={() => { setMethod('email'); resetMessages() }} />
            Email
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="radio" checked={method === 'phone'} onChange={() => { setMethod('phone'); resetMessages() }} />
            Mobile Number
          </label>
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
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '1.1rem' }}>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.1rem' }}>
            <div style={{ position: 'relative' }}>
              {method === 'email' ? (
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              ) : (
                <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              )}
              {method === 'email' ? (
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                />
              ) : (
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  style={inputStyle}
                  required
                />
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                required
                minLength={6}
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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); resetMessages() }}
            style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  )
}