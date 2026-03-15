import { useState, useCallback } from 'react'
import { generateBrief } from '../api/generateBrief'

const DEMO_ACTIVE_TASK = {
  patient: 'Priya Patel',
  bed: 14,
  taskType: 'Medication administration',
  step: 2,
  totalSteps: 3,
  notes: 'Identity confirmed, Metformin 500mg retrieved from cabinet',
  category: null,
}

export function useCheckpoint() {
  const [activeTask, setActiveTask] = useState(DEMO_ACTIVE_TASK)
  const [checkpoint, setCheckpoint] = useState(null)
  const [interruptions, setInterruptions] = useState([])
  const [screen, setScreen] = useState('home')
  const [brief, setBrief] = useState(null)
  const [briefLoading, setBriefLoading] = useState(false)

  const saveCheckpoint = useCallback((category) => {
    const savedAt = new Date()
    const id = savedAt.getTime().toString()
    const cp = {
      ...activeTask,
      id,
      category,
      savedAt: savedAt.getTime(),
    }
    setCheckpoint(cp)
    const interruption = {
      id,
      patient: activeTask.patient,
      bed: activeTask.bed,
      taskType: activeTask.taskType,
      savedAt: savedAt.getTime(),
      resumedAt: null,
      category,
    }
    setInterruptions((prev) => [...prev, interruption])
    setScreen('resume')
    setBrief(null)
    setBriefLoading(true)
    generateBrief(cp, 0)
      .then((text) => {
        setBrief(text)
      })
      .catch(() => {
        setBrief('Unable to generate brief. Please resume from your notes.')
      })
      .finally(() => {
        setBriefLoading(false)
      })
  }, [activeTask])

  const startSaving = useCallback(() => {
    setScreen('saving')
  }, [])

  const resumeTask = useCallback(() => {
    const now = Date.now()
    const cpId = checkpoint?.id
    setInterruptions((prev) =>
      prev.map((i) =>
        i.id === cpId ? { ...i, resumedAt: now } : i
      )
    )
    setCheckpoint(null)
    setBrief(null)
    setScreen('home')
  }, [checkpoint])

  const goToScreen = useCallback((s) => {
    setScreen(s)
  }, [])

  const getElapsedMinutes = useCallback((savedAt) => {
    if (!savedAt) return 0
    return Math.floor((Date.now() - savedAt) / 60000)
  }, [])

  const hasCheckpoint = !!checkpoint

  return {
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
  }
}
