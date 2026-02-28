'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Brain, ShoppingBag, Star, MapPin, Sun, Droplets } from 'lucide-react'

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f9fbf2 0%, #eef5e0 50%, #e5f0d0 100%)',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(106,170,79,0.12) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(181,196,42,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }} className="hero-grid">

            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(106,170,79,0.12)',
                color: 'var(--primary)',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                border: '1px solid rgba(106,170,79,0.2)'
              }}>
                <Leaf size={14} />
                Kerala&apos;s First AI Farming Assistant
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                lineHeight: '1.15',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)'
              }}>
                Grow Fresh Food<br />
                <span style={{ color: 'var(--primary)' }}>On Your Rooftop</span><br />
                With AI Guidance
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                marginBottom: '2.5rem',
                maxWidth: '480px'
              }}>
                Enter your rooftop dimensions and location in Kerala. Our AI analyses your space, climate and sunlight to recommend the perfect crops and guide you through every step.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/planner" className="btn-primary" style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.9rem 2rem'
                }}>
                  <Brain size={18} />
                  Try AI Planner Free
                </Link>
                <Link href="/shop" className="btn-secondary" style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.9rem 2rem'
                }}>
                  <ShoppingBag size={18} />
                  Browse Shop
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap'
              }}>
                {[
                  { value: '500+', label: 'Happy Growers' },
                  { value: '50+', label: 'Products' },
                  { value: '14', label: 'Districts Covered' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — AI Planner Preview Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(106,170,79,0.15)',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '380px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Brain size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>AI Rooftop Planner</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Powered by Gemini AI</div>
                  </div>
                </div>

                {/* Mock form fields */}
                {[
                  { icon: MapPin, label: 'District', value: 'Kozhikode' },
                  { icon: Sun, label: 'Rooftop Size', value: '400 sq ft' },
                  { icon: Droplets, label: 'Purpose', value: 'Vegetables & Herbs' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.75rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}>
                    <Icon size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
                    </div>
                  </div>
                ))}

                {/* Mock result */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(106,170,79,0.1), rgba(181,196,42,0.1))',
                  border: '1px solid rgba(106,170,79,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>AI Recommendations</div>
                  {['Cherry Tomato', 'Kanthari Chilli', 'Curry Leaf', 'Moringa'].map(crop => (
                    <div key={crop} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.85rem', color: 'var(--text-primary)',
                      padding: '0.25rem 0'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                      {crop}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>Why AgriKerala?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              Built specifically for Kerala&apos;s climate, culture and rooftop farming needs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: Brain,
                title: 'AI Powered Planning',
                desc: 'Our AI analyses your rooftop dimensions, Kerala district climate, sunlight and season to give you the most accurate crop recommendations possible.'
              },
              {
                icon: MapPin,
                title: 'Kerala Specific',
                desc: 'Every recommendation is tailored for Kerala\'s unique humid tropical climate, monsoon patterns and local growing conditions across all 14 districts.'
              },
              {
                icon: Leaf,
                title: 'Full Care Guides',
                desc: 'Get month by month care instructions for every recommended crop. Watering schedules, fertilizing tips, pest control and harvest guidance included.'
              },
              {
                icon: ShoppingBag,
                title: 'Buy What You Need',
                desc: 'Every AI recommendation links directly to the seeds or plants in our shop. Order via WhatsApp and get delivered to your doorstep across Kerala.'
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '2rem' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: 'rgba(106,170,79,0.1)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={22} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Popular Products</h2>
            <Link href="/shop" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { name: 'Cherry Tomato Seeds', price: 49, original: 79, badge: 'Best Seller', rating: 4.8, category: 'Vegetable Seeds' },
              { name: 'Kanthari Chilli Seeds', price: 45, original: 65, badge: 'Kerala Special', rating: 4.9, category: 'Vegetable Seeds' },
              { name: 'Curry Leaf Plant', price: 89, original: 129, badge: 'Must Have', rating: 4.7, category: 'Herbs & Spices' },
              { name: 'Organic Vermicompost', price: 69, original: 99, badge: 'Organic', rating: 4.8, category: 'Fertilizers' },
            ].map(product => (
              <div key={product.name} className="card">
                {/* Image placeholder */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #eef5e0, #d5e8b0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Leaf size={48} color="rgba(106,170,79,0.3)" />
                  {product.badge && (
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'var(--primary)', color: 'white',
                      fontSize: '0.75rem', fontWeight: '600',
                      padding: '0.3rem 0.75rem', borderRadius: '999px'
                    }}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{product.category}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{product.rating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹{product.original}</span>
                    </div>
                    <Link href="/shop" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, var(--primary), var(--olive))',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: '1rem' }}>
            Ready to Start Your Rooftop Garden?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Let our AI analyse your rooftop and give you a personalized farming plan built for your Kerala home.
          </p>
          <Link href="/planner" style={{
            background: 'white',
            color: 'var(--primary)',
            padding: '1rem 2.5rem',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
          }}>
            <Brain size={18} />
            Start AI Planner — It&apos;s Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}