import React from 'react'

const cardBase = {
  background: '#fff',
  border: '0.5px solid #e0e0e0',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
}

const leftAccent = {
  borderLeft: '4px solid #1976d2',
}

const urgentTint = {
  background: 'rgba(211, 47, 47, 0.06)',
}

export function TaskCard({ patient, bed, taskType, step, totalSteps, notes, showAccent = true, urgent = false }) {
  const style = {
    ...cardBase,
    ...(showAccent ? leftAccent : {}),
    ...(urgent ? urgentTint : {}),
  }
  return (
    <div style={style}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{patient}</div>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Bed {bed}</div>
      <div style={{ fontSize: 14, marginBottom: 6 }}>{taskType}</div>
      <div style={{ fontSize: 13, color: '#555' }}>
        Step {step} of {totalSteps}
      </div>
      {notes && (
        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>{notes}</div>
      )}
    </div>
  )
}
