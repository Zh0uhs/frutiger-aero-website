'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Track {
  title: string
  artist: string
  url: string
}

const tracks: Track[] = [
  {
    title: 'Clark',
    artist: 'C418',
    url: '/music/C418 - Clark.mp3',
  },
  {
    title: 'Moog City 2',
    artist: 'C418',
    url: '/music/C418 - Moog City 2.mp3',
  },
  {
    title: 'Sweden',
    artist: 'C418',
    url: '/music/C418 - Sweden.mp3',
  },
  {
    title: 'Main Menu',
    artist: 'Mii Maker',
    url: '/music/Mii Maker - Main Menu (TV).mp3',
  },
  {
    title: 'Mii Editor',
    artist: 'Mii Maker',
    url: '/music/Mii Maker - Mii Editor (TV).mp3',
  },
  {
    title: 'Wii U Menu',
    artist: 'Nintendo',
    url: '/music/Wii U Menu - In Use.mp3',
  },
]

interface AudioState {
  isPlaying: boolean
  currentTrack: number
  currentTime: number
  duration: number
  progress: number
  tracks: Track[]
}

let globalAudioInstance: HTMLAudioElement | null = null
let globalState: AudioState = {
  isPlaying: false,
  currentTrack: 4,
  currentTime: 0,
  duration: 0,
  progress: 0,
  tracks: tracks,
}
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach(listener => listener())
}

export function useAudio() {
  const [state, setState] = useState<AudioState>(globalState)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!globalAudioInstance) {
      globalAudioInstance = new Audio()
      globalAudioInstance.src = tracks[4].url
      globalAudioInstance.volume = 0.6
      globalAudioInstance.preload = 'auto'

      const audio = globalAudioInstance

      const updateTime = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          globalState.currentTime = audio.currentTime
          globalState.duration = audio.duration
          globalState.progress = (audio.currentTime / audio.duration) * 100
          notifyListeners()
        }
      }

      const handleEnded = () => {
        const nextTrackIndex = (globalState.currentTrack + 1) % tracks.length
        globalAudioInstance!.pause()
        globalAudioInstance!.src = tracks[nextTrackIndex].url
        globalAudioInstance!.load()
        globalState.currentTrack = nextTrackIndex
        globalState.currentTime = 0
        globalState.progress = 0
        if (globalState.isPlaying) {
          globalAudioInstance!.play().catch(() => {})
        }
        notifyListeners()
      }

      const handleError = () => {
        console.warn('Audio load error, continuing to next track')
      }

      const handleCanPlay = () => {
        updateTime()
        if (globalState.isPlaying) {
          audio.play().catch(() => {})
        }
      }

      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('loadedmetadata', updateTime)
      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('error', handleError)

      globalState.isPlaying = true
    }

    audioRef.current = globalAudioInstance

    const listener = () => {
      setState({ ...globalState })
    }
    listeners.add(listener)
    setState({ ...globalState })

    return () => {
      listeners.delete(listener)
    }
  }, [])

  const changeTrack = useCallback((index: number) => {
    if (globalAudioInstance) {
      const wasPlaying = globalState.isPlaying
      globalAudioInstance.pause()
      globalAudioInstance.src = tracks[index].url
      globalAudioInstance.load()
      
      globalState.currentTrack = index
      globalState.currentTime = 0
      globalState.progress = 0

      if (wasPlaying) {
        globalAudioInstance.play().catch(() => {})
      }
      notifyListeners()
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (globalAudioInstance) {
      if (globalState.isPlaying) {
        globalAudioInstance.pause()
        globalState.isPlaying = false
      } else {
        globalAudioInstance.play().catch(() => {})
        globalState.isPlaying = true
      }
      notifyListeners()
    }
  }, [])

  const nextTrack = useCallback(() => {
    const nextIndex = (globalState.currentTrack + 1) % tracks.length
    changeTrack(nextIndex)
  }, [changeTrack])

  const prevTrack = useCallback(() => {
    const prevIndex = (globalState.currentTrack - 1 + tracks.length) % tracks.length
    changeTrack(prevIndex)
  }, [changeTrack])

  const seek = useCallback(
    (progress: number) => {
      if (globalAudioInstance && globalAudioInstance.duration && !isNaN(globalAudioInstance.duration)) {
        globalAudioInstance.currentTime = (progress / 100) * globalAudioInstance.duration
        globalState.currentTime = globalAudioInstance.currentTime
        globalState.progress = progress
        notifyListeners()
      }
    },
    []
  )

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    ...state,
    currentTrackInfo: tracks[state.currentTrack],
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    formatTime,
  }
}
