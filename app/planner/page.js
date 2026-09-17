'use client'

import { useState, useEffect, useRef } from 'react'
import PlannerForm from '../../components/PlannerForm'
import ResultCard from '../../components/ResultCard'
import { Brain, MapPin, Leaf, ChevronRight } from 'lucide-react'

export default function PlannerPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [retrySeconds, setRetrySeconds] = useState(0)
  const submitting = useRef(false)

  useEffect(() => {
    if (retrySeconds <= 0) return
    const timer = setTimeout(() => setRetrySeconds(seconds => Math.max(0, seconds - 1)), 1000)
    return () => clearTimeout(timer)
  }, [retrySeconds])

  const handleSubmit = async (formData) => {
    if (submitting.current || retrySeconds > 0) return
    submitting.current = true
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        if (response.status === 429 && Number.isFinite(data.retryAfterSeconds)) {
          setRetrySeconds(Math.max(0, Math.ceil(data.retryAfterSeconds)))
        }
        return
      }

      setResults(data.data)
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)

    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #eef5e0, #e0edc8)',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(106,170,79,0.12)', color: 'var(--primary)',
          padding: '0.5rem 1rem', borderRadius: '999px',
          fontSize: '0.85rem', fontWeight: '600',
          marginBottom: '1.25rem',
          border: '1px solid rgba(106,170,79,0.2)'
        }}>
          <Brain size={14} />
          Powered by Gemini AI
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1rem' }}>
          AI Rooftop Farming Planner
        </h1>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.05rem',
          maxWidth: '560px', margin: '0 auto', lineHeight: '1.8'
        }}>
          Tell us about your rooftop and location in Kerala. Our AI will analyse your space and recommend the best crops with complete care guides.
        </p>

        {/* Steps */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap'
        }}>
          {[
            { icon: MapPin, label: 'Enter Details' },
            { icon: Brain, label: 'AI Analyses' },
            { icon: Leaf, label: 'Get Recommendations' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                padding: '0.5rem 1rem', borderRadius: '999px',
                fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)'
              }}>
                <Icon size={14} color="var(--primary)" />
                {label}
              </div>
              {i < 2 && <ChevronRight size={16} color="var(--text-secondary)" />}
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '3rem',
          alignItems: 'start'
        }} className="planner-grid">

          {/* Form */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'sticky',
            top: '90px'
          }}>
            <h2 style={{
              fontSize: '1.3rem', marginBottom: '0.5rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700'
            }}>
              Your Rooftop Details
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Fill in all fields for the most accurate recommendations.
            </p>

            <PlannerForm onSubmit={handleSubmit} loading={loading} retrySeconds={retrySeconds} />
          </div>

          {/* Results */}
          <div id="results">
            {!results && !loading && !error && (
              <div style={{
                textAlign: 'center', padding: '4rem 2rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px'
              }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'rgba(106,170,79,0.1)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <Brain size={36} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Your Plan Will Appear Here
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  Fill in your rooftop details on the left and our AI will generate a personalized farming plan for your Kerala home.
                </p>
              </div>
            )}

            {loading && (
              <div style={{
                textAlign: 'center', padding: '4rem 2rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px'
              }}>
                <div style={{
                  width: '60px', height: '60px',
                  border: '3px solid var(--border)',
                  borderTop: '3px solid var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 1.5rem'
                }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Analysing Your Rooftop...
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7' }}>
                  Our AI is studying your location and rooftop conditions and preparing your complete plan. This may take a little while.
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    'Analysing Kerala climate data...',
                    'Studying your district conditions...',
                    'Selecting best crops for your space...',
                    'Preparing care guides...'
                  ].map((step, i) => (
                    <div key={i} style={{
                      fontSize: '0.82rem', color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%', background: 'var(--primary)',
                        animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`
                      }} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div role="alert" style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '16px', padding: '1.5rem',
                color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {results && (
              <div>
                {/* Climate Summary */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '36px', height: '36px',
                      background: 'rgba(106,170,79,0.1)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MapPin size={18} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Climate Analysis — {results.district}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rooftop area: {results.area} sq ft</div>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.88rem', color: 'var(--text-secondary)',
                    lineHeight: '1.8',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {results.climateAnalysis}
                  </p>
                </div>

                {/* Results Header */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Your Recommended Crops
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Click on each crop to see the full care guide
                  </p>
                </div>

                {/* Crop Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {results.crops.map((crop, index) => {
                    const careGuide = results.careGuides?.find(
                      g => g.cropName?.toLowerCase() === crop.name?.toLowerCase()
                    )
                    return (
                      <ResultCard
                        key={index}
                        crop={crop}
                        careGuide={careGuide}
                        index={index}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @media (max-width: 768px) {
          .planner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
