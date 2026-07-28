'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { verifyAdmin } from '../../../lib/adminAuth'
import Link from 'next/link'
import {
  ShoppingCart, Package, TrendingUp, Brain,
  Sprout, Eye, LogOut, Check, Truck, X
} from 'lucide-react'

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      router.push('/admin/login')
      return
    }
    setAuthChecked(true)
    fetchOrders()
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    await fetchOrders()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const statusColor = {
    pending: { bg: '#fef3c7', color: '#d97706' },
    confirmed: { bg: '#dbeafe', color: '#2563eb' },
    dispatched: { bg: '#f3e8ff', color: '#7c3aed' },
    delivered: { bg: '#dcfce7', color: '#16a34a' },
    cancelled: { bg: '#fef2f2', color: '#dc2626' },
  }

  if (!authChecked) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', flexShrink: 0,
        background: 'var(--text-primary)',
        padding: '1.5rem',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--primary)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sprout size={18} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>UrbanSprout</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/admin/dashboard', active: false },
            { icon: Package, label: 'Products', href: '/admin/products', active: false },
            { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', active: true },
            { icon: Brain, label: 'Planner Logs', href: '#', active: false },
            { icon: Eye, label: 'View Site', href: '/', active: false },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '10px',
              textDecoration: 'none',
              background: active ? 'rgba(106,170,79,0.2)' : 'transparent',
              color: active ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
              fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', padding: '0.5rem 0'
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '0.25rem' }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{orders.length} total orders</p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['all', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '0.45rem 1.1rem', borderRadius: '999px',
              border: '1px solid',
              borderColor: filter === s ? 'var(--primary)' : 'var(--border)',
              background: filter === s ? 'var(--primary)' : 'var(--surface)',
              color: filter === s ? 'white' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}>
              {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Product', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '1rem', textAlign: 'left',
                    fontSize: '0.78rem', fontWeight: '700',
                    color: 'var(--text-secondary)', textTransform: 'uppercase',
                    letterSpacing: '0.04em', whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No orders found
                  </td>
                </tr>
              ) : filtered.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{order.customer_name || 'WhatsApp Order'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{order.customer_phone || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '500' }}>{order.product_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Qty: {order.quantity}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
                      ₹{order.total_price || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: '700',
                      padding: '0.25rem 0.75rem', borderRadius: '999px',
                      background: statusColor[order.status]?.bg || '#f3f4f6',
                      color: statusColor[order.status]?.color || '#6b7280'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {order.status === 'pending' && (
                        <button onClick={() => updateStatus(order.id, 'confirmed')} style={{
                          background: 'rgba(37,99,235,0.1)', border: 'none',
                          borderRadius: '8px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer', color: '#2563eb',
                          fontSize: '0.78rem', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          <Check size={12} /> Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateStatus(order.id, 'dispatched')} style={{
                          background: 'rgba(124,58,237,0.1)', border: 'none',
                          borderRadius: '8px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer', color: '#7c3aed',
                          fontSize: '0.78rem', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          <Truck size={12} /> Dispatch
                        </button>
                      )}
                      {order.status === 'dispatched' && (
                        <button onClick={() => updateStatus(order.id, 'delivered')} style={{
                          background: 'rgba(22,163,74,0.1)', border: 'none',
                          borderRadius: '8px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer', color: '#16a34a',
                          fontSize: '0.78rem', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          <Check size={12} /> Delivered
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')} style={{
                          background: 'rgba(239,68,68,0.1)', border: 'none',
                          borderRadius: '8px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer', color: '#ef4444',
                          fontSize: '0.78rem', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}