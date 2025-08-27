import axios from 'axios'
import singleton from 'licia/singleton'

type Health = {
  status: 'healthy'
  model_loaded: boolean
}

const api = axios.create({
  baseURL: `http://127.0.1:7860`,
  headers: {
    'Content-Type': 'application/json',
  },
})

;(async () => {
  const port = await main.getIndexTTSPort()
  api.defaults.baseURL = `http://127.0.0.1:${port}`
})()

export async function checkHealth(): Promise<Health> {
  const response = await api.get<Health>('/api/health')

  return response.data
}

export const wait = singleton(async function (checkInterval = 5) {
  return new Promise((resolve) => {
    async function check() {
      if (!(await main.isIndexTTSRunning())) {
        return resolve(false)
      }
      try {
        await checkHealth()
        return resolve(true)
      } catch {
        // ignore
      }
      setTimeout(check, checkInterval * 1000)
    }
    check()
  })
})
