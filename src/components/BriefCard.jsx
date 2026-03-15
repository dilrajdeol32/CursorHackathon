import React from 'react'

const cardStyle = {
  background: '#fff',
  border: '0.5px solid #e0e0e0',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderLeft: '4px solid #1976d2',
}

const labelStyle = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#1976d2',
  marginBottom: 8,
}

const ellipsisStyle = {
  display: 'inline-block',
  animation: 'briefEllipsis 1.2s infinite',
}

export function BriefCard({ label = 'Checkpoint assistant', brief, loading }) {
  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{label}</div>
      {loading ? (
        <span><span style={ellipsisStyle}>Generating brief</span><span className="brief-ellipsis-dots">...</span></span>
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.5, color: '#333' }}>{brief}</div>
      )}
    </div>
  )
}
