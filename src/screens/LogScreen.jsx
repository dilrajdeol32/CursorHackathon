import React from 'react'

const pageStyle = {
  padding: '16px 16px 80px',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 24,
}

const statCardStyle = {
  background: '#fff',
  border: '0.5px solid #e0e0e0',
  borderRadius: 12,
  padding: 16,
}

const statLabelStyle = {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
}

const statValueStyle = {
  fontSize: 20,
  fontWeight: 700,
}

const listItemStyle = {
  background: '#fff',
  border: '0.5px solid #e0e0e0',
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
}

const categoryBadgeStyles = {
  Physician: { background: '#fff3e0', color: '#e65100' },
  'Call light': { background: '#e3f2fd', color: '#0277bd' },
  Staff: { background: '#e8f5e9', color: '#2e7d32' },
  Other: { background: '#f5f5f5', color: '#616161' },
}

function getCategoryStyle(category) {
  return categoryBadgeStyles[category] || categoryBadgeStyles.Other
}

function getPeakHour(interruptions) {
  if (!interruptions.length) return '--'
  const byHour = {}
  interruptions.forEach((i) => {
    const h = new Date(i.savedAt).getHours()
    byHour[h] = (byHour[h] || 0) + 1
  })
  const peak = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]
  return peak ? `${peak[0]}:00` : '--'
}

function getAvgDurationMinutes(interruptions) {
  const withResumed = interruptions.filter((i) => i.resumedAt != null)
  if (!withResumed.length) return '--'
  const total = withResumed.reduce((acc, i) => acc + (i.resumedAt - i.savedAt) / 60000, 0)
  return Math.round(total / withResumed.length)
}

export function LogScreen({ interruptions }) {
  const count = interruptions.length
  const avgDuration = getAvgDurationMinutes(interruptions)
  const peakHour = getPeakHour(interruptions)

  return (
    <div style={pageStyle} className="screen-content">
      <div style={gridStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Interruptions</div>
          <div style={statValueStyle}>{count}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Avg duration</div>
          <div style={statValueStyle}>{avgDuration}{avgDuration !== '--' ? 'm' : ''}</div>
        </div>
        <div style={{ ...statCardStyle, gridColumn: '1 / -1' }}>
          <div style={statLabelStyle}>Peak hour</div>
          <div style={statValueStyle}>{peakHour}</div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>All interruptions</div>
      {interruptions.length === 0 ? (
        <div style={{ fontSize: 14, color: '#888' }}>No interruptions recorded</div>
      ) : (
        interruptions.map((i) => {
          const duration = i.resumedAt
            ? Math.round((i.resumedAt - i.savedAt) / 60000)
            : null
          const cs = getCategoryStyle(i.category)
          return (
            <div key={i.id} style={listItemStyle}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                {i.patient} · Bed {i.bed}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{i.taskType}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 6,
                    ...cs,
                  }}
                >
                  {i.category}
                </span>
                {duration != null && (
                  <span style={{ fontSize: 12, color: '#888' }}>{duration}m</span>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
