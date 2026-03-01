'use client'

import { useState } from 'react'
import { MapPin, Maximize, Sun, Leaf, Clock, ChevronDown } from 'lucide-react'

const districts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
]

export default function PlannerForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    district: '',
    length: '',
    width: '',
    roofType: '',
    sunlight: '',
    purpose: '',
    timePerWeek: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isValid = Object.values(formData).every(v => v !== '')

  const selectStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  }

  const fieldWrapper = {
    position: 'relative'
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }} className="form-grid">

        {/* District */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            <MapPin size={14} />
            Your District
          </label>
          <div style={fieldWrapper}>
            <select
              value={formData.district}
              onChange={e => handleChange('district', e.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select your district</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Length */}
        <div>
          <label style={labelStyle}>
            <Maximize size={14} />
            Rooftop Length (ft)
          </label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={formData.length}
            onChange={e => handleChange('length', e.target.value)}
            style={inputStyle}
            min="5"
            required
          />
        </div>

        {/* Width */}
        <div>
          <label style={labelStyle}>
            <Maximize size={14} />
            Rooftop Width (ft)
          </label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={formData.width}
            onChange={e => handleChange('width', e.target.value)}
            style={inputStyle}
            min="5"
            required
          />
        </div>

        {/* Roof Type */}
        <div>
          <label style={labelStyle}>
            <Leaf size={14} />
            Roof Type
          </label>
          <div style={fieldWrapper}>
            <select
              value={formData.roofType}
              onChange={e => handleChange('roofType', e.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select roof type</option>
              <option value="Open Terrace">Open Terrace</option>
              <option value="Partially Covered">Partially Covered</option>
              <option value="Shade Net Covered">Shade Net Covered</option>
              <option value="Greenhouse Setup">Greenhouse Setup</option>
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Sunlight */}
        <div>
          <label style={labelStyle}>
            <Sun size={14} />
            Daily Sunlight
          </label>
          <div style={fieldWrapper}>
            <select
              value={formData.sunlight}
              onChange={e => handleChange('sunlight', e.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select sunlight hours</option>
              <option value="Less than 3 hours">Less than 3 hours</option>
              <option value="3 to 5 hours">3 to 5 hours</option>
              <option value="5 to 8 hours">5 to 8 hours</option>
              <option value="More than 8 hours">More than 8 hours</option>
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label style={labelStyle}>
            <Leaf size={14} />
            Farming Purpose
          </label>
          <div style={fieldWrapper}>
            <select
              value={formData.purpose}
              onChange={e => handleChange('purpose', e.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select purpose</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Herbs and Spices">Herbs and Spices</option>
              <option value="Flowers">Flowers</option>
              <option value="Mixed — Vegetables and Herbs">Mixed — Vegetables and Herbs</option>
              <option value="Mixed — Everything">Mixed — Everything</option>
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Time per week */}
        <div>
          <label style={labelStyle}>
            <Clock size={14} />
            Time Per Week (hours)
          </label>
          <div style={fieldWrapper}>
            <select
              value={formData.timePerWeek}
              onChange={e => handleChange('timePerWeek', e.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select available time</option>
              <option value="1 to 2">1 to 2 hours</option>
              <option value="3 to 5">3 to 5 hours</option>
              <option value="5 to 10">5 to 10 hours</option>
              <option value="More than 10">More than 10 hours</option>
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Submit */}
        <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={!isValid || loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isValid && !loading ? 'var(--primary)' : 'var(--border)',
              color: isValid && !loading ? 'white' : 'var(--text-secondary)',
              border: 'none', borderRadius: '999px',
              fontSize: '1rem', fontWeight: '700',
              cursor: isValid && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.75rem'
            }}
            onMouseEnter={e => { if (isValid && !loading) e.currentTarget.style.background = 'var(--olive)' }}
            onMouseLeave={e => { if (isValid && !loading) e.currentTarget.style.background = 'var(--primary)' }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Analysing your rooftop...
              </>
            ) : (
              <>
                <Leaf size={18} />
                Generate My Farming Plan
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid > div[style*="span 2"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </form>
  )
}