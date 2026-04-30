'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  isLoading: boolean
  error: string | null
  location: string
}

interface WeatherCode {
  code: number
  description: string
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'thunder' | 'fog'
}

const weatherCodes: WeatherCode[] = [
  { code: 0, description: 'Clear sky', icon: 'sun' },
  { code: 1, description: 'Mainly clear', icon: 'sun' },
  { code: 2, description: 'Partly cloudy', icon: 'cloud' },
  { code: 3, description: 'Overcast', icon: 'cloud' },
  { code: 45, description: 'Foggy', icon: 'fog' },
  { code: 48, description: 'Rime fog', icon: 'fog' },
  { code: 51, description: 'Light drizzle', icon: 'rain' },
  { code: 53, description: 'Drizzle', icon: 'rain' },
  { code: 55, description: 'Heavy drizzle', icon: 'rain' },
  { code: 61, description: 'Light rain', icon: 'rain' },
  { code: 63, description: 'Rain', icon: 'rain' },
  { code: 65, description: 'Heavy rain', icon: 'rain' },
  { code: 71, description: 'Light snow', icon: 'snow' },
  { code: 73, description: 'Snow', icon: 'snow' },
  { code: 75, description: 'Heavy snow', icon: 'snow' },
  { code: 80, description: 'Light showers', icon: 'rain' },
  { code: 81, description: 'Showers', icon: 'rain' },
  { code: 82, description: 'Heavy showers', icon: 'rain' },
  { code: 95, description: 'Thunderstorm', icon: 'thunder' },
  { code: 96, description: 'Thunderstorm', icon: 'thunder' },
  { code: 99, description: 'Thunderstorm', icon: 'thunder' },
]

function getWeatherInfo(code: number): { description: string; icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'thunder' | 'fog' } {
  const info = weatherCodes.find((w) => w.code === code)
  if (info) {
    return { description: info.description, icon: info.icon }
  }
  return { description: 'Unknown', icon: 'cloud' }
}

// Default location (Beijing)
const DEFAULT_LAT = 39.9042
const DEFAULT_LON = 116.4074

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    feelsLike: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    isLoading: true,
    error: null,
    location: 'Detecting...',
  })

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number, locationName: string) => {
      try {
        // Fetch weather data from Open-Meteo
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        )

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const weatherData = await weatherResponse.json()
        const current = weatherData.current
        const weatherInfo = getWeatherInfo(current.weather_code)

        setWeather({
          temperature: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          condition: weatherInfo.description,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          isLoading: false,
          error: null,
          location: locationName,
        })
      } catch (error) {
        console.error('Weather fetch error:', error)
        setWeather({
          temperature: 0,
          feelsLike: 0,
          condition: 'Unavailable',
          humidity: 0,
          windSpeed: 0,
          isLoading: false,
          error: 'Unable to fetch weather',
          location: locationName,
        })
      }
    }

    const getLocation = async () => {
      // Try browser geolocation first
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 300000, // 5 minutes cache
            })
          })

          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          
          // Try to get location name from coordinates
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            const geoData = await geoResponse.json()
            const locationName = geoData.address?.city || 
                                 geoData.address?.town || 
                                 geoData.address?.village ||
                                 geoData.address?.state ||
                                 'Your Location'
            fetchWeather(latitude, longitude, locationName)
          } catch {
            fetchWeather(latitude, longitude, `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`)
          }
          return
        } catch (geoError) {
          console.log('Browser geolocation failed, falling back to IP geolocation')
        }
      }

      // Fallback to IP-based geolocation
      try {
        const geoResponse = await fetch('https://ipapi.co/json/')
        const geoData = await geoResponse.json()
        const latitude = geoData.latitude || DEFAULT_LAT
        const longitude = geoData.longitude || DEFAULT_LON
        const city = geoData.city || geoData.country_name || 'Unknown'
        fetchWeather(latitude, longitude, city)
      } catch {
        // Final fallback to Beijing
        fetchWeather(DEFAULT_LAT, DEFAULT_LON, 'Beijing (Default)')
      }
    }

    getLocation()
    
    // Refresh every 30 minutes
    const interval = setInterval(getLocation, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return weather
}
