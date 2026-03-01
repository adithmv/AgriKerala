'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import ProductCard from '../../components/ProductCard'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProducts()
    // eslint-disable-next-line react-hooks/immutability
    fetchCategories()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProducts(data)
    setLoading(false)
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
    if (!error) setCategories(['All', ...data.map(c => c.name)])
  }

  const filtered = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #eef5e0, #e0edc8)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>
          Our Products
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Seeds, plants, fertilizers and tools — everything you need for rooftop farming in Kerala.
        </p>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

        {/* Search + Filter Bar */}
        <div style={{
          display: 'flex', gap: '1rem',
          marginBottom: '2rem', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            flex: 1, minWidth: '220px',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '0.7rem 1.25rem'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', outline: 'none',
                background: 'transparent',
                fontSize: '0.9rem', color: 'var(--text-primary)',
                width: '100%'
              }}
            />
          </div>

          {/* Filter icon */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: 'var(--text-secondary)', fontSize: '0.85rem'
          }}>
            <SlidersHorizontal size={16} />
            Filter
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex', gap: '0.75rem',
          flexWrap: 'wrap', marginBottom: '2.5rem'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
                background: activeCategory === cat ? 'var(--primary)' : 'var(--surface)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {loading ? 'Loading products...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                height: '380px', borderRadius: '16px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No products found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}