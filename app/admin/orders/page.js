'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { verifyAdmin } from '../../../lib/adminAuth'
import Link from 'next/link'
import {
  ShoppingCart, Package, TrendingUp, Brain,
  Sprout, Eye, LogOut, Check, Truck, X,
  Plus, Pencil, Trash2
} from 'lucide-react'

const EMPTY_FORM = {
  customer_name: '',
  customer_phone: '',
  product_name: '',
  quantity: 1,
  total_price: '',
  address: '',
  status: 'pending'
}

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [filter, setFilter] = useState('all')

  // Manual add/edit modal state
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null) // null = adding new
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    if (showModal) dialogRef.current?.showModal()
  }, [showModal])

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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setError(error ? `Could not load orders: ${error.message}` : '')
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select('id').single()
    if (error || !data) {
      setError(`Could not update order: ${error?.message || 'Order not found or access denied.'}`)
      return
    }
    await fetchOrders()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // ---- Manual add / edit / delete ----

  function openAddModal() {
    setFormError('')
    setEditingOrder(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEditModal(order) {
    setFormError('')
    setEditingOrder(order)
    setForm({
      customer_name: order.customer_name || '',
      customer_phone: order.customer_phone || '',
      product_name: order.product_name || '',
      quantity: order.quantity || 1,
      total_price: order.total_price ?? '',
      address: order.address || '',
      status: order.status || 'pending'
    })
    setShowModal(true)
  }

  function closeModal() {
    if (saving) return
    setShowModal(false)
    setEditingOrder(null)
    setForm(EMPTY_FORM)
  }

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function saveOrder(e) {
    e.preventDefault()
    if (saving) return
    setFormError('')
    const quantity = Number(form.quantity)
    const price = form.total_price === '' ? null : Number(form.total_price)
    if (!form.product_name.trim() || !Number.isSafeInteger(quantity) || quantity < 1 ||
        (price !== null && (!Number.isFinite(price) || price < 0))) {
      setFormError('Enter a product name, a whole quantity of at least 1, and a non-negative price.')
      return
    }
    setSaving(true)

    const payload = {
      customer_name: form.customer_name.trim() || null,
      customer_phone: form.customer_phone.trim() || null,
      product_name: form.product_name.trim(),
      quantity,
      total_price: price,
      address: form.address.trim() || null,
      status: form.status
    }

    try {
      const query = editingOrder
        ? supabase.from('orders').update(payload).eq('id', editingOrder.id)
        : supabase.from('orders').insert(payload)
      const { data, error } = await query.select('id').single()
      if (error) throw error
      if (!data) throw new Error('Order not found or access denied.')
      setShowModal(false)
      setEditingOrder(null)
      setForm(EMPTY_FORM)
      await fetchOrders()
    } catch (error) {
      setFormError(`Could not save order: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function deleteOrder(id) {
    const confirmed = window.confirm('Delete this order permanently? This cannot be undone.')
    if (!confirmed) return
    const { data, error } = await supabase.from('orders').delete().eq('id', id).select('id').single()
    if (error || !data) {
      setError(`Could not delete order: ${error?.message || 'Order not found or access denied.'}`)
      return
    }
    await fetchOrders()
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
        <div style={{
          marginBottom: '2rem', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '0.25rem' }}>Orders</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{orders.length} total orders</p>
          </div>
          <button onClick={openAddModal} className="btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', border: 'none', cursor: 'pointer'
          }}>
            <Plus size={16} /> Add Order
          </button>
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
        {error && <p role="alert" style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Address', 'Product', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
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
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                  <td style={{ padding: '1rem', maxWidth: '200px' }}>
                    <div style={{
                      fontSize: '0.82rem', color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {order.address || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '500' }}>{order.product_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Qty: {order.quantity}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
                      ₹{order.total_price ?? '—'}
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
                      {order.status === 'cancelled' && (
                        <button onClick={() => updateStatus(order.id, 'pending')} style={{
                          background: 'rgba(107,114,128,0.1)', border: 'none',
                          borderRadius: '8px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer', color: '#6b7280',
                          fontSize: '0.78rem', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          Restore
                        </button>
                      )}
                      <button onClick={() => openEditModal(order)} title="Edit order" style={{
                        background: 'rgba(0,0,0,0.05)', border: 'none',
                        borderRadius: '8px', padding: '0.4rem 0.6rem',
                        cursor: 'pointer', color: 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center'
                      }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteOrder(order.id)} title="Delete order" style={{
                        background: 'rgba(0,0,0,0.05)', border: 'none',
                        borderRadius: '8px', padding: '0.4rem 0.6rem',
                        cursor: 'pointer', color: '#ef4444',
                        display: 'flex', alignItems: 'center'
                      }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Order Modal */}
      {showModal && (
        <dialog
          ref={dialogRef}
          aria-labelledby="order-modal-title"
          onCancel={e => { e.preventDefault(); closeModal() }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem', width: '100vw', height: '100vh',
            maxWidth: 'none', maxHeight: 'none', border: 'none', margin: 0
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card"
            style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 id="order-modal-title" style={{ fontSize: '1.15rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {editingOrder ? 'Edit Order' : 'Add Order'}
              </h2>
              <button onClick={closeModal} disabled={saving} aria-label="Close order form" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', display: 'flex'
              }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && <p role="alert" style={{ color: '#dc2626' }}>{formError}</p>}
              <div>
                <label htmlFor="order-customer_name" style={labelStyle}>Customer Name</label>
                <input
                  type="text"
                  id="order-customer_name" disabled={saving} value={form.customer_name}
                  onChange={e => handleFormChange('customer_name', e.target.value)}
                  placeholder="e.g. Adith M V"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="order-customer_phone" style={labelStyle}>Customer Phone</label>
                <input
                  type="text"
                  id="order-customer_phone" disabled={saving} value={form.customer_phone}
                  onChange={e => handleFormChange('customer_phone', e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="order-address" style={labelStyle}>Address</label>
                <textarea
                  id="order-address" disabled={saving} value={form.address}
                  onChange={e => handleFormChange('address', e.target.value)}
                  placeholder="Delivery address"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label htmlFor="order-product_name" style={labelStyle}>Product Name *</label>
                <input
                  type="text"
                  required
                  id="order-product_name" disabled={saving} value={form.product_name}
                  onChange={e => handleFormChange('product_name', e.target.value)}
                  placeholder="e.g. Grow Bag - 15L"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="order-quantity" style={labelStyle}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    step="1"
                    id="order-quantity" disabled={saving} value={form.quantity}
                    onChange={e => handleFormChange('quantity', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="order-total_price" style={labelStyle}>Total Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    id="order-total_price" disabled={saving} value={form.total_price}
                    onChange={e => handleFormChange('total_price', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="order-status" style={labelStyle}>Status</label>
                <select
                  id="order-status" disabled={saving} value={form.status}
                  onChange={e => handleFormChange('status', e.target.value)}
                  style={inputStyle}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                  style={{ flex: 1, border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 1, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Saving...' : editingOrder ? 'Save Changes' : 'Add Order'}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: '600',
  color: 'var(--text-secondary)', marginBottom: '0.4rem'
}

const inputStyle = {
  width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
  border: '1px solid var(--border)', background: 'var(--bg)',
  fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box'
}
