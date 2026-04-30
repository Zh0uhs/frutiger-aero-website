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

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTrack: 0,
    currentTime: 0,
    duration: 0,
    progress: 0,
    tracks: tracks,
  })

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.src = state.tracks[0].url
    audioRef.current.volume = 0.6
    audioRef.current.preload = 'auto'

    const audio = audioRef.current

    const updateTime = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration,
          progress: (audio.currentTime / audio.duration) * 100,
        }))
      }
    }

    const handleEnded = () => {
      const nextTrackIndex = (state.currentTrack + 1) % state.tracks.length
      changeTrack(nextTrackIndex)
    }

    const handleError = () => {
      console.warn('Audio load error, continuing to next track')
    }

    const handleCanPlay = () => {
      updateTime()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', updateTime)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', updateTime)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const changeTrack = useCallback((index: number) => {
    if (audioRef.current) {
      const wasPlaying = state.isPlaying
      audioRef.current.pause()
      audioRef.current.src = state.tracks[index].url
      audioRef.current.load()
      
      setState((prev) => ({
        ...prev,
        currentTrack: index,
        currentTime: 0,
        progress: 0,
      }))

      if (wasPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [state.isPlaying, state.tracks])

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
      setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
    }
  }, [state.isPlaying])

  const nextTrack = useCallback(() => {
    const nextIndex = (state.currentTrack + 1) % state.tracks.length
    changeTrack(nextIndex)
  }, [state.currentTrack, state.tracks, changeTrack])

  const prevTrack = useCallback(() => {
    const prevIndex = (state.currentTrack - 1 + state.tracks.length) % state.tracks.length
    changeTrack(prevIndex)
  }, [state.currentTrack, state.tracks, changeTrack])

  const seek = useCallback(
    (progress: number) => {
      if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        audioRef.current.currentTime = (progress / 100) * audioRef.current.duration
        setState((prev) => ({
          ...prev,
          currentTime: audioRef.current!.currentTime,
          progress,
        }))
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
    currentTrackInfo: state.tracks[state.currentTrack],
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    formatTime,
  }
}
