import React from 'react'

const pageStyle = {
  padding: '16px 16px 80px',
}

const titleStyle = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 20,
}

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
}

const categoryButtonStyle = {
  padding: '12px 20px',
  borderRadius: 12,
  border: '0.5px solid #e0e0e0',
  background: '#fff',
  fontSize: 14,
  cursor: 'pointer',
}

export function SavingScreen({ saveCheckpoint }) {
  const categories = ['Physician', 'Call light', 'Staff', 'Other']

  return (
    <div style={pageStyle} className="screen-content">
      <h2 style={titleStyle}>Why are you stepping away?</h2>
      <div style={rowStyle}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            style={categoryButtonStyle}
            onClick={() => saveCheckpoint(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
