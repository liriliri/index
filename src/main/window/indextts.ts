import { resolveUnpack } from 'share/main/lib/util'
import getFreePort from 'licia/getPort'
import * as window from 'share/main/lib/window'
import extend from 'licia/extend'
import childProcess, { ChildProcessByStdio } from 'child_process'
import { Readable } from 'stream'
import { app } from 'electron'

let port = 7860
export const getPort = () => port

let isDead = false
let subprocess: ChildProcessByStdio<null, Readable, Readable>

export async function start() {
  const appDir = resolveUnpack('indextts/index-tts')

  let PATH = process.env.PATH
  const binPath = resolveUnpack('indextts/installer_files/env/bin')
  PATH = `${binPath}:${PATH}`

  const env = {
    PATH,
  }

  port = await getFreePort(port, '127.0.0.1')

  extend(process.env, env)
  subprocess = childProcess.spawn('python', ['webui.py'], {
    cwd: appDir,
    windowsHide: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  })
  subprocess.stdout.on('data', (data) => process.stdout.write(data))
  subprocess.stderr.on('data', (data) => process.stderr.write(data))
  subprocess.on('exit', (code, signal) => {
    console.log('Index TTS exit', code, signal)
    isDead = true
  })
  subprocess.on('error', (err) => {
    console.log('Index TTS error', err)
    if (!subprocess.pid) {
      isDead = true
    }
    window.sendAll('webUIError')
  })

  app.on('will-quit', () => subprocess.kill())
}

export function isRunning() {
  return !isDead
}

export function quit() {
  if (subprocess) {
    subprocess.kill()
  }
}
