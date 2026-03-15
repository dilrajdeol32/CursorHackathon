import React from 'react'
import { TaskCard } from '../components/TaskCard'
import { BriefCard } from '../components/BriefCard'

const pageStyle = {
  padding: '16px 16px 80px',
}

const buttonStyle = {
  width: '100%',
  height: 56,
  background: '#2e7d32',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 24,
}

export function ResumeScreen({ checkpoint, brief, briefLoading, resumeTask, getElapsedMinutes }) {
  if (!checkpoint) {
    return (
      <div style={pageStyle} className="screen-content">
        <div style={{ fontSize: 14, color: '#666' }}>No saved checkpoint. Save one from Tasks.</div>
      </div>
    )
  }

  const elapsedMinutes = getElapsedMinutes(checkpoint.savedAt)
  const urgent = elapsedMinutes >= 5

  return (
    <div style={pageStyle} className="screen-content">
      <TaskCard
        patient={checkpoint.patient}
        bed={checkpoint.bed}
        taskType={checkpoint.taskType}
        step={checkpoint.step}
        totalSteps={checkpoint.totalSteps}
        notes={checkpoint.notes}
        showAccent={true}
        urgent={urgent}
      />

      <BriefCard label="Checkpoint assistant" brief={brief} loading={briefLoading} />

      <button type="button" style={buttonStyle} onClick={resumeTask}>
        Resume task
      </button>
    </div>
  )
}
