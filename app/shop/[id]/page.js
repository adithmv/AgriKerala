'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { Star, ArrowLeft, Leaf, MessageCircle, Package, Truck, Shield } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProduct()
  }, [id])

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (!error) setProduct(data)
    setLoading(false)
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in buying *${product.name}* from UrbanSprout.\n\nPrice: ₹${product.price}\nCategory: ${product.category}\n\nPlease confirm availability.`
    const url = `https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading product...</div>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Product not found.</p>
      <Link href="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  )

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div className="container">

        {/* Back */}
        <Link href="/shop" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          color: 'var(--text-secondary)', textDecoration: 'none',
          fontSize: '0.9rem', fontWeight: '500', marginBottom: '2rem',
          transition: 'color 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start'
        }} className="product-grid">

          {/* Image */}
          <div style={{
            background: 'linear-gradient(135deg, #eef5e0, #d5e8b0)',
            borderRadius: '20px',
            height: '420px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Leaf size={80} color="rgba(106,170,79,0.3)" />
            )}
            {product.badge && (
              <div style={{
                position: 'absolute', top: '16px', left: '16px',
                background: 'var(--primary)', color: 'white',
                fontSize: '0.8rem', fontWeight: '700',
                padding: '0.4rem 1rem', borderRadius: '999px'
              }}>
                {product.badge}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
              {product.category}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '1rem', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16}
                  color="#f59e0b"
                  fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                />
              ))}
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{product.rating}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</span>
              {product.original_price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{product.original_price}</span>
                  <span style={{
                    background: 'rgba(106,170,79,0.12)', color: 'var(--primary)',
                    fontSize: '0.85rem', fontWeight: '700',
                    padding: '0.25rem 0.75rem', borderRadius: '999px'
                  }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Details */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Product Details
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.7' }}>
                {product.details}
              </p>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsApp}
              disabled={!product.in_stock}
              style={{
                width: '100%',
                background: product.in_stock ? '#25d366' : 'var(--border)',
                color: product.in_stock ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: '999px',
                padding: '1rem',
                fontSize: '1rem', fontWeight: '700',
                cursor: product.in_stock ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.3s',
                marginBottom: '1rem'
              }}
              onMouseEnter={e => { if (product.in_stock) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <MessageCircle size={20} />
              {product.in_stock ? 'Order via WhatsApp' : 'Out of Stock'}
            </button>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {[
                { icon: Truck, text: 'Delivery across Kerala' },
                { icon: Package, text: 'Secure packaging' },
                { icon: Shield, text: '100% Authentic' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.8rem', color: 'var(--text-secondary)'
                }}>
                  <Icon size={14} color="var(--primary)" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}