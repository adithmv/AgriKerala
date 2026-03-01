'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import {
  Plus, Pencil, Trash2, Package,
  TrendingUp, ShoppingCart, Brain,
  Sprout, Eye, LogOut, X, Check
} from 'lucide-react'

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '', price: '',
    original_price: '', description: '',
    details: '', badge: '', in_stock: true,
    whatsapp_number: '', image_url: ''
  })

  useEffect(() => {
    checkAuth()
    fetchProducts()
    fetchCategories()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  function openAddForm() {
    setEditingProduct(null)
    setForm({
      name: '', category: '', price: '',
      original_price: '', description: '',
      details: '', badge: '', in_stock: true,
      whatsapp_number: '', image_url: ''
    })
    setShowForm(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.original_price || '',
      description: product.description || '',
      details: product.details || '',
      badge: product.badge || '',
      in_stock: product.in_stock,
      whatsapp_number: product.whatsapp_number || '',
      image_url: product.image_url || ''
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      ...form,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      badge: form.badge || null,
      image_url: form.image_url || null
    }

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    await fetchProducts()
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    await fetchProducts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid var(--border)', borderRadius: '10px',
    background: 'var(--bg)', color: 'var(--text-primary)',
    fontSize: '0.9rem', outline: 'none'
  }

  const labelStyle = {
    fontSize: '0.78rem', fontWeight: '700',
    color: 'var(--text-secondary)', marginBottom: '0.4rem',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em'
  }

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
            <div style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>AgriKerala</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/admin/dashboard', active: false },
            { icon: Package, label: 'Products', href: '/admin/products', active: true },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '0.25rem' }}>Products</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{products.length} products total</p>
          </div>
          <button onClick={openAddForm} className="btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
          }}>
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
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
                    Loading products...
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{product.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      ₹{product.price}
                      {product.original_price && <span style={{ textDecoration: 'line-through', marginLeft: '0.4rem' }}>₹{product.original_price}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: '700',
                      padding: '0.25rem 0.75rem', borderRadius: '999px',
                      background: product.in_stock ? '#dcfce7' : '#fef2f2',
                      color: product.in_stock ? '#16a34a' : '#dc2626'
                    }}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {product.badge || '—'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditForm(product)} style={{
                        background: 'rgba(59,130,246,0.1)', border: 'none',
                        borderRadius: '8px', padding: '0.5rem',
                        cursor: 'pointer', color: '#3b82f6', display: 'flex'
                      }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{
                        background: 'rgba(239,68,68,0.1)', border: 'none',
                        borderRadius: '8px', padding: '0.5rem',
                        cursor: 'pointer', color: '#ef4444', display: 'flex'
                      }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '20px',
            padding: '2rem', width: '100%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'
              }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Product Name</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cherry Tomato Seeds" />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Badge (optional)</label>
                <input style={inputStyle} value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Best Seller" />
              </div>

              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="49" />
              </div>

              <div>
                <label style={labelStyle}>Original Price (₹)</label>
                <input style={inputStyle} type="number" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} placeholder="79" />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Product Image</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '12px', padding: '1.5rem',
                  textAlign: 'center', cursor: 'pointer',
                  background: 'var(--bg)', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  {form.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img src={form.image_url} alt="preview" style={{
                        width: '100%', height: '160px',
                        objectFit: 'cover', borderRadius: '8px'
                      }} />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm({ ...form, image_url: '' }) }}
                        style={{
                          position: 'absolute', top: '8px', right: '8px',
                          background: 'rgba(0,0,0,0.6)', border: 'none',
                          borderRadius: '50%', width: '28px', height: '28px',
                          cursor: 'pointer', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Package size={32} color="var(--text-secondary)" style={{ margin: '0 auto 0.75rem' }} />
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Click to upload image
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Date.now()}.${fileExt}`
                    const { data, error } = await supabase.storage
                      .from('product-images')
                      .upload(fileName, file)
                    if (!error) {
                      const { data: urlData } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(fileName)
                      setForm({ ...form, image_url: urlData.publicUrl })
                    }
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Product Details</label>
                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Package contents, germination rate, etc..." />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Image URL (optional)</label>
                <input style={inputStyle} value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>

              <div>
                <label style={labelStyle}>WhatsApp Number</label>
                <input style={inputStyle} value={form.whatsapp_number} onChange={e => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="919876543210" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                <input type="checkbox" id="instock" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                <label htmlFor="instock" style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>In Stock</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
                <Check size={16} />
                {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}