'use client'

import Link from 'next/link'
import { Star, ShoppingCart, Leaf } from 'lucide-react'
import { createWhatsAppOrderUrl } from '../lib/whatsapp'

export default function ProductCard({ product }) {
  const handleWhatsApp = (e) => {
    e.preventDefault()
    const message = `Hi, I'm interested in buying *${product.name}* from UrbanSprout. Price: ₹${product.price}`
    window.open(createWhatsAppOrderUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{
        height: '200px',
        background: 'linear-gradient(135deg, #eef5e0, #d5e8b0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Leaf size={52} color="rgba(106,170,79,0.3)" />
        )}

        {/* Badge */}
        {product.badge && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'var(--primary)', color: 'white',
            fontSize: '0.72rem', fontWeight: '700',
            padding: '0.3rem 0.8rem', borderRadius: '999px',
            letterSpacing: '0.03em'
          }}>
            {product.badge}
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)'
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '500' }}>
          {product.category}
        </div>

        <h3 style={{
          fontSize: '1rem', fontWeight: '700',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.4'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          lineHeight: '1.6', marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <Star size={13} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{product.rating}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({product.reviews})</span>
        </div>

        {/* Price + Button */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
              ₹{product.price}
            </span>
            {product.original_price && (
              <span style={{
                fontSize: '0.85rem', color: 'var(--text-secondary)',
                textDecoration: 'line-through', marginLeft: '0.5rem'
              }}>
                ₹{product.original_price}
              </span>
            )}
          </div>

          <button
            onClick={handleWhatsApp}
            disabled={!product.in_stock}
            style={{
              background: product.in_stock ? 'var(--primary)' : 'var(--border)',
              color: product.in_stock ? 'white' : 'var(--text-secondary)',
              border: 'none', borderRadius: '999px',
              padding: '0.55rem 1.1rem',
              fontSize: '0.82rem', fontWeight: '600',
              cursor: product.in_stock ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { if (product.in_stock) e.currentTarget.style.background = 'var(--olive)' }}
            onMouseLeave={e => { if (product.in_stock) e.currentTarget.style.background = 'var(--primary)' }}
          >
            <ShoppingCart size={14} />
            Order
          </button>
        </div>

        {/* View Details */}
        <Link href={`/shop/${product.id}`} style={{
          display: 'block', textAlign: 'center',
          marginTop: '0.75rem', fontSize: '0.82rem',
          color: 'var(--text-secondary)', textDecoration: 'none',
          fontWeight: '500', transition: 'color 0.2s'
        }}
          onMouseEnter={e => e.target.style.color = 'var(--primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
