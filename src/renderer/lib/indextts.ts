import axios from 'axios'
import singleton from 'licia/singleton'

type Health = {
  status: 'healthy'
  model_loaded: boolean
}

type InferOptions = {
  output_path: string
  infer_mode: string
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

export async function infer(text: string, audio: Blob, options: InferOptions) {
  const formData = new FormData()
  formData.append('text', text)
  formData.append('prompt_audio', audio)
  formData.append('output_path', options.output_path)
  formData.append('infer_mode', options.infer_mode)

  const response = await api.post<{
    output_path: string
  }>('/api/infer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.output_path
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
