import React from 'react'
import { useCheckpoint } from './hooks/useCheckpoint'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { SavingScreen } from './screens/SavingScreen'
import { ResumeScreen } from './screens/ResumeScreen'
import { LogScreen } from './screens/LogScreen'

const appStyle = {
  minHeight: '100vh',
  background: '#f5f5f5',
  maxWidth: 390,
  margin: '0 auto',
  position: 'relative',
  paddingBottom: 60,
}

const contentStyle = {
  transition: 'opacity 200ms ease, transform 200ms ease',
}

function App() {
  const {
    activeTask,
    checkpoint,
    interruptions,
    screen,
    brief,
    briefLoading,
    saveCheckpoint,
    startSaving,
    resumeTask,
    goToScreen,
    getElapsedMinutes,
    hasCheckpoint,
  } = useCheckpoint()

  const navScreen = screen === 'saving' ? 'home' : screen

  const handleNav = (tab) => {
    if (tab === 'home') goToScreen('home')
    else if (tab === 'resume') goToScreen('resume')
    else if (tab === 'log') goToScreen('log')
  }

  return (
    <div style={appStyle}>
      <div style={contentStyle} className="screen-wrapper">
        {screen === 'home' && (
          <HomeScreen
            activeTask={activeTask}
            interruptions={interruptions}
            startSaving={startSaving}
            getElapsedMinutes={getElapsedMinutes}
          />
        )}
        {screen === 'saving' && (
          <SavingScreen saveCheckpoint={saveCheckpoint} />
        )}
        {screen === 'resume' && (
          <ResumeScreen
            checkpoint={checkpoint}
            brief={brief}
            briefLoading={briefLoading}
            resumeTask={resumeTask}
            getElapsedMinutes={getElapsedMinutes}
          />
        )}
        {screen === 'log' && (
          <LogScreen interruptions={interruptions} />
        )}
      </div>

      <BottomNav
        currentScreen={navScreen}
        onNavigate={handleNav}
        hasCheckpoint={hasCheckpoint}
      />
    </div>
  )
}

export default App
