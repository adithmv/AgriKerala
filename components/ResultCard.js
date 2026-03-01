'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Clock, Package, Droplets, Sun, Bug, Scissors, ShoppingCart } from 'lucide-react'

export default function ResultCard({ crop, careGuide, index }) {
  const [expanded, setExpanded] = useState(index === 0)

  const difficultyColor = {
    'Easy': '#22c55e',
    'Medium': '#f59e0b',
    'Hard': '#ef4444'
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s'
    }}>

      {/* Card Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: expanded ? 'linear-gradient(135deg, rgba(106,170,79,0.05), rgba(181,196,42,0.05))' : 'var(--surface)',
          transition: 'background 0.3s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Number */}
          <div style={{
            width: '40px', height: '40px',
            background: 'var(--primary)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '1rem',
            flexShrink: 0
          }}>
            {index + 1}
          </div>

          <div>
            <h3 style={{
              fontSize: '1.1rem', fontWeight: '700',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: 'var(--text-primary)', marginBottom: '0.2rem'
            }}>
              {crop.name}
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {crop.malayalamName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{
              background: `${difficultyColor[crop.difficulty]}20`,
              color: difficultyColor[crop.difficulty],
              fontSize: '0.75rem', fontWeight: '700',
              padding: '0.25rem 0.75rem', borderRadius: '999px'
            }}>
              {crop.difficulty}
            </span>
            <span style={{
              background: 'rgba(106,170,79,0.1)',
              color: 'var(--primary)',
              fontSize: '0.75rem', fontWeight: '700',
              padding: '0.25rem 0.75rem', borderRadius: '999px'
            }}>
              {crop.timeToHarvest}
            </span>
          </div>

          {expanded ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>

          {/* Why recommended */}
          <div style={{
            background: 'rgba(106,170,79,0.06)',
            border: '1px solid rgba(106,170,79,0.15)',
            borderRadius: '12px',
            padding: '1rem',
            margin: '1.25rem 0'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Why this crop for you
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.7' }}>
              {crop.whyRecommended}
            </p>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { icon: Package, label: 'Container Size', value: crop.containerSize },
              { icon: Clock, label: 'Harvest Time', value: crop.timeToHarvest },
              { icon: Scissors, label: 'Expected Yield', value: crop.expectedYield },
              { icon: Sun, label: 'Best Season', value: crop.bestSeason },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <Icon size={13} color="var(--primary)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Care Guide */}
          {careGuide && (
            <div>
              <h4 style={{
                fontSize: '0.85rem', fontWeight: '700',
                color: 'var(--text-secondary)', textTransform: 'uppercase',
                letterSpacing: '0.04em', marginBottom: '1rem'
              }}>
                Care Guide
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }} className="care-grid">
                {[
                  { icon: Droplets, label: 'Watering', value: careGuide.watering },
                  { icon: Sun, label: 'Sunlight', value: careGuide.sunlight },
                  { icon: Package, label: 'Soil Mix', value: careGuide.soilMix },
                  { icon: Bug, label: 'Pest Control', value: careGuide.commonPests },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Icon size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Monthly Tips */}
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>
                  Monthly Tips
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(careGuide.monthlyTips).map(([month, tip], i) => (
                    <div key={month} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '24px', height: '24px', flexShrink: 0,
                        background: 'var(--primary)', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: 'white', fontWeight: '700'
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.6', paddingTop: '0.1rem' }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Harvest Tips */}
              <div style={{
                background: 'rgba(181,196,42,0.08)',
                border: '1px solid rgba(181,196,42,0.2)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--olive)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.4rem' }}>
                  Harvest Tips
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{careGuide.harvestTips}</p>
              </div>
            </div>
          )}

          {/* Buy Button */}
          <Link href={`/shop?search=${encodeURIComponent(crop.name)}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', width: '100%',
            background: 'var(--primary)', color: 'white',
            padding: '0.85rem', borderRadius: '999px',
            textDecoration: 'none', fontWeight: '700',
            fontSize: '0.9rem', transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--olive)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            <ShoppingCart size={16} />
            Buy Seeds / Plants for {crop.name}
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .care-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}