import React from 'react'
import { TaskCard } from '../components/TaskCard'

const pageStyle = {
  padding: '16px 16px 80px',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
}

const titleStyle = {
  fontSize: 24,
  fontWeight: 700,
  margin: 0,
}

const badgeStyle = {
  background: '#2e7d32',
  color: '#fff',
  fontSize: 12,
  padding: '4px 10px',
  borderRadius: 20,
}

const sectionTitleStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: '#333',
  marginBottom: 8,
}

const buttonStyle = {
  width: '100%',
  height: 56,
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 16,
  marginBottom: 24,
}

const dividerStyle = {
  height: 1,
  background: '#e0e0e0',
  margin: '20px 0',
}

const categoryColors = {
  Physician: '#ed6c02',
  'Call light': '#0288d1',
  Staff: '#2e7d32',
  Other: '#757575',
}

function InterruptionItem({ category, patient, bed, taskType, savedAt, getElapsedMinutes }) {
  const elapsed = getElapsedMinutes(savedAt)
  const dotColor = categoryColors[category] || '#757575'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 0',
        borderBottom: '0.5px solid #eee',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          marginTop: 5,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{patient}, Bed {bed} – {taskType}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{category} · {elapsed}m ago</div>
      </div>
    </div>
  )
}

export function HomeScreen({ activeTask, interruptions, startSaving, getElapsedMinutes }) {
  return (
    <div style={pageStyle} className="screen-content">
      <header style={headerStyle}>
        <h1 style={titleStyle}>Checkpoint</h1>
        <span style={badgeStyle}>Day shift</span>
      </header>

      <div style={sectionTitleStyle}>Active task</div>
      <TaskCard
        patient={activeTask.patient}
        bed={activeTask.bed}
        taskType={activeTask.taskType}
        step={activeTask.step}
        totalSteps={activeTask.totalSteps}
        notes={activeTask.notes}
        showAccent={true}
      />

      <button type="button" style={buttonStyle} onClick={startSaving}>
        Save checkpoint
      </button>

      <div style={dividerStyle} />
      <div style={sectionTitleStyle}>This session</div>
      {interruptions.length === 0 ? (
        <div style={{ fontSize: 14, color: '#888' }}>No interruptions yet</div>
      ) : (
        interruptions.map((i) => (
          <InterruptionItem
            key={i.id}
            category={i.category}
            patient={i.patient}
            bed={i.bed}
            taskType={i.taskType}
            savedAt={i.savedAt}
            getElapsedMinutes={getElapsedMinutes}
          />
        ))
      )}
    </div>
  )
}
