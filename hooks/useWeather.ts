'use client'

import { useState, useEffect, useRef } from 'react'

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

const DEFAULT_LAT = 39.9042
const DEFAULT_LON = 116.4074
const DEFAULT_CITY = 'Beijing'

const debugLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  const timestamp = new Date().toLocaleTimeString()
  const colors = {
    info: '%c[Weather DEBUG]',
    warn: '%c[Weather WARN]',
    error: '%c[Weather ERROR]'
  }
  const colorStyles = {
    info: 'color: #00b4d8; font-weight: bold;',
    warn: 'color: #ffbe0b; font-weight: bold;',
    error: 'color: #ef233c; font-weight: bold;'
  }
  console.log(`${colors[type]} ${timestamp}: ${message}`, colorStyles[type])
}

const showNotification = (title: string, message: string, type: 'info' | 'warning' | 'error' = 'info') => {
  const toastContainer = document.createElement('div')
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    max-width: 320px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transform: translateX(120%);
    transition: transform 0.3s ease-out;
  `
  
  if (type === 'error') {
    toastContainer.style.background = 'linear-gradient(135deg, #ef233c, #dc2626)'
  } else if (type === 'warning') {
    toastContainer.style.background = 'linear-gradient(135deg, #ffbe0b, #f59e0b)'
  } else {
    toastContainer.style.background = 'linear-gradient(135deg, #00b4d8, #0284c7)'
  }
  
  toastContainer.innerHTML = `
    <div style="font-size: 14px; opacity: 0.9;">${title}</div>
    <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${message}</div>
  `
  
  document.body.appendChild(toastContainer)
  
  setTimeout(() => {
    toastContainer.style.transform = 'translateX(0)'
  }, 10)
  
  setTimeout(() => {
    toastContainer.style.transform = 'translateX(120%)'
    setTimeout(() => {
      toastContainer.remove()
    }, 300)
  }, 5000)
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 27,
    feelsLike: 24,
    condition: 'Clear sky',
    humidity: 45,
    windSpeed: 12,
    isLoading: false,
    error: null,
    location: DEFAULT_CITY,
  })
  
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    
    const addDebugStep = (step: string) => {
      debugLog(step)
    }

    const fetchWeatherData = async (latitude: number, longitude: number, cityName: string) => {
      addDebugStep(`🌡️ Fetching weather for ${cityName} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
      
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        )
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error ${response.status}: ${errorText}`)
        }
        
        const data = await response.json()
        const current = data.current
        const weatherInfo = getWeatherInfo(current.weather_code)
        
        if (isMountedRef.current) {
          setWeather({
            temperature: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.apparent_temperature),
            condition: weatherInfo.description,
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            isLoading: false,
            error: null,
            location: cityName,
          })
        }
        
        addDebugStep(`🎉 Weather update successful: ${cityName}, ${current.temperature_2m}°C`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        addDebugStep(`❌ Weather fetch failed: ${errorMsg}`)
        showNotification('天气获取失败', `无法获取天气数据: ${errorMsg}`, 'error')
      }
    }

    const getLocationByIP = async () => {
      addDebugStep('📍 Starting IP geolocation (using Chinese APIs)...')
      
      const services = [
        { 
          name: '淘宝IP', 
          url: 'http://ip.taobao.com/service/getIpInfo.php', 
          parse: (d: any) => {
            const data = d.data
            return {
              ip: data.ip,
              lat: parseFloat(data.latitude) || DEFAULT_LAT,
              lon: parseFloat(data.longitude) || DEFAULT_LON,
              city: data.city || data.region || data.country || DEFAULT_CITY
            }
          }
        },
        { 
          name: '腾讯IP', 
          url: 'https://apis.map.qq.com/ws/location/v1/ip', 
          params: { key: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77' },
          parse: (d: any) => {
            const result = d.result
            return {
              ip: result.ip,
              lat: parseFloat(result.location.lat) || DEFAULT_LAT,
              lon: parseFloat(result.location.lng) || DEFAULT_LON,
              city: result.ad_info.city || result.ad_info.province || result.ad_info.nation || DEFAULT_CITY
            }
          }
        },
        { 
          name: '新浪IP', 
          url: 'http://int.dpool.sina.com.cn/iplookup/iplookup.php', 
          params: { format: 'json' },
          parse: (d: any) => ({ 
            ip: d.ip,
            lat: DEFAULT_LAT,
            lon: DEFAULT_LON,
            city: d.city || d.province || d.country || DEFAULT_CITY
          }) 
        },
        { 
          name: 'ipinfo.io', 
          url: 'https://ipinfo.io/json', 
          parse: (d: any) => ({ 
            ip: d.ip,
            lat: parseFloat(d.loc?.split(',')[0]), 
            lon: parseFloat(d.loc?.split(',')[1]), 
            city: d.city || d.region || d.country 
          }) 
        },
      ]
      
      for (const service of services) {
        addDebugStep(`🔍 Trying ${service.name}...`)
        try {
          let url = service.url
          if (service.params) {
            const params = new URLSearchParams(service.params)
            url += '?' + params.toString()
          }
          
          const response = await fetch(url, { 
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            }
          })
          
          addDebugStep(`✅ ${service.name} responded (status: ${response.status})`)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const text = await response.text()
          let data
          try {
            data = JSON.parse(text)
          } catch {
            throw new Error('Invalid JSON response')
          }
          
          if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
            throw new Error(`API error: ${data.message || data.reason || 'Unknown error'}`)
          }
          
          const result = service.parse(data)
          
          const lat = result.lat || DEFAULT_LAT
          const lon = result.lon || DEFAULT_LON
          const city = result.city || DEFAULT_CITY
          const ip = result.ip || 'unknown'
          
          console.log('%c[IP INFO]', 'color: #10b981; font-weight: bold;', `Your public IP: ${ip}`)
          
          if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Invalid coordinates')
          }
          
          addDebugStep(`📍 Location found: ${city} (${lat.toFixed(4)}, ${lon.toFixed(4)})`)
          
          await fetchWeatherData(lat, lon, city)
          return
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error'
          addDebugStep(`❌ ${service.name} failed: ${errorMsg}`)
        }
      }
      
      addDebugStep('⚠️ All IP services failed, using default location (Beijing)')
      showNotification('位置获取失败', '无法通过IP确定位置，使用默认城市北京', 'warning')
      await fetchWeatherData(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY)
    }

    getLocationByIP()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  return weather
}
