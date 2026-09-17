'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { verifyAdmin } from '../../../lib/adminAuth'
import Link from 'next/link'
import {
  Package, ShoppingCart, Brain, TrendingUp,
  LogOut, Sprout, Plus, Eye, Clock
} from 'lucide-react'

function formatDuration(ms) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return '—'
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const seconds = Math.round(ms / 1000)
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalPlannerUses: 0,
    avgAiTimeMs: null
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topDistricts, setTopDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      router.push('/admin/login')
      return
    }
    setAdminEmail(session.user.email)
    setAuthChecked(true)
    fetchStats()
    fetchRecentOrders()
    fetchTopDistricts()
  }

  async function fetchStats() {
    const [products, orders, pending, planner] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('id', { count: 'exact' }),
      supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('planner_logs').select('id', { count: 'exact' })
    ])

    // Page through recorded durations so the average is not limited to
    // Supabase's default maximum rows per response.
    let totalDuration = 0
    let durationCount = 0
    let durationError = false
    const pageSize = 500
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase.from('planner_logs')
        .select('duration_ms').not('duration_ms', 'is', null)
        .order('id').range(offset, offset + pageSize - 1)
      if (error) {
        console.error('Could not load planner durations:', error.message)
        durationError = true
        break
      }
      for (const { duration_ms } of data || []) {
        if (Number.isFinite(duration_ms) && duration_ms >= 0) {
          totalDuration += duration_ms
          durationCount++
        }
      }
      if (!data || data.length < pageSize) break
    }

    setStats({
      totalProducts: products.count || 0,
      totalOrders: orders.count || 0,
      pendingOrders: pending.count || 0,
      totalPlannerUses: planner.count || 0,
      avgAiTimeMs: !durationError && durationCount ? totalDuration / durationCount : null
    })
    setLoading(false)
  }

  async function fetchRecentOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    if (data) setRecentOrders(data)
  }

  async function fetchTopDistricts() {
    const { data } = await supabase
      .from('planner_logs')
      .select('district')
    if (data) {
      const counts = {}
      data.forEach(({ district }) => {
        counts[district] = (counts[district] || 0) + 1
      })
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([district, count]) => ({ district, count }))
      setTopDistricts(sorted)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const statCards = [
    { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'var(--primary)', link: '/admin/products' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: '#3b82f6', link: '/admin/orders' },
    { icon: TrendingUp, label: 'Pending Orders', value: stats.pendingOrders, color: '#f59e0b', link: '/admin/orders' },
    { icon: Brain, label: 'Planner Uses', value: stats.totalPlannerUses, color: '#8b5cf6', link: '#' },
    { icon: Clock, label: 'Avg AI Response Time', value: formatDuration(stats.avgAiTimeMs), color: '#0ea5e9', link: '#' },
  ]

  if (!authChecked) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', flexShrink: 0,
        background: 'var(--text-primary)',
        padding: '1.5rem',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--primary)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sprout size={18} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>UrbanSprout</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/admin/dashboard', active: true },
            { icon: Package, label: 'Products', href: '/admin/products', active: false },
            { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', active: false },
            { icon: Brain, label: 'Planner Logs', href: '#', active: false },
            { icon: Eye, label: 'View Site', href: '/', active: false },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '10px',
              textDecoration: 'none',
              background: active ? 'rgba(106,170,79,0.2)' : 'transparent',
              color: active ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
              fontSize: '0.9rem', fontWeight: '500',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
            {adminEmail}
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem',
              padding: '0.5rem 0', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '0.25rem' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Welcome back. Here is what is happening with UrbanSprout today.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {statCards.map(({ icon: Icon, label, value, color, link }) => (
            <Link key={label} href={link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: `${color}15`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} color={color} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
                  {loading ? '—' : value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {label}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="bottom-grid">

          {/* Recent Orders */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Orders</h2>
              <Link href="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>View All</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem 0' }}>
                No orders yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentOrders.map(order => (
                  <div key={order.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem', background: 'var(--bg)', borderRadius: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{order.product_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{order.customer_name}</div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem', fontWeight: '700',
                      padding: '0.25rem 0.75rem', borderRadius: '999px',
                      background: order.status === 'pending' ? '#fef3c7' : '#dcfce7',
                      color: order.status === 'pending' ? '#d97706' : '#16a34a'
                    }}>
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Districts */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Top Districts Using Planner</h2>
            </div>
            {topDistricts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem 0' }}>
                No planner data yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topDistricts.map(({ district, count }, i) => (
                  <div key={district} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '24px', height: '24px', flexShrink: 0,
                      background: 'var(--primary)', borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', color: 'white', fontWeight: '700'
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{district}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{count} uses</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '999px' }}>
                        <div style={{
                          height: '100%', borderRadius: '999px',
                          background: 'var(--primary)',
                          width: `${(count / (topDistricts[0]?.count || 1)) * 100}%`
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/products" className="btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
          }}>
            <Plus size={16} />
            Add New Product
          </Link>
          <Link href="/admin/orders" className="btn-secondary" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
          }}>
            <ShoppingCart size={16} />
            Manage Orders
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
