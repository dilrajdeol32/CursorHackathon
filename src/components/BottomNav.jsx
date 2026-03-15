import React from 'react'

const navStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: 390,
  margin: '0 auto',
  display: 'flex',
  background: '#fff',
  borderTop: '0.5px solid #e0e0e0',
  padding: '8px 0',
  zIndex: 100,
}

const tabStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 4px',
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: '#666',
  cursor: 'pointer',
}

const activeTabStyle = {
  ...tabStyle,
  color: '#1976d2',
  fontWeight: 600,
}

const badgeWrapStyle = {
  position: 'relative',
  display: 'inline-block',
}

const badgeStyle = {
  position: 'absolute',
  top: -2,
  right: -10,
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#d32f2f',
}

export function BottomNav({ currentScreen, onNavigate, hasCheckpoint }) {
  const tabs = [
    { id: 'home', label: 'Tasks' },
    { id: 'resume', label: 'Resume', showBadge: hasCheckpoint },
    { id: 'log', label: 'Log' },
  ]

  return (
    <nav style={navStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          style={currentScreen === tab.id ? activeTabStyle : tabStyle}
          onClick={() => onNavigate(tab.id)}
        >
          <span style={badgeWrapStyle}>
            {tab.label}
            {tab.showBadge && <span style={badgeStyle} />}
          </span>
        </button>
      ))}
    </nav>
  )
}
