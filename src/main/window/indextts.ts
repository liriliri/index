import { handleEvent, resolveUnpack } from 'share/main/lib/util'
import getFreePort from 'licia/getPort'
import * as window from 'share/main/lib/window'
import extend from 'licia/extend'
import childProcess, { ChildProcessByStdio } from 'child_process'
import { Readable } from 'stream'
import { app, BrowserWindow } from 'electron'
import once from 'licia/once'
import { IpcGetIndexTTSPort, IpcIsIndexTTSRunning } from '../../common/types'

let port = 7860
const getPort: IpcGetIndexTTSPort = () => port

let isDead = false
let subprocess: ChildProcessByStdio<null, Readable, Readable>

export async function init() {
  await start()
  initIpc()
}

async function start() {
  const appDir = resolveUnpack('indextts/index-tts')

  let PATH = process.env.PATH
  const binPath = resolveUnpack('indextts/installer_files/env/bin')
  PATH = `${binPath}:${PATH}`

  const env = {
    PATH,
  }

  port = await getFreePort(port, '127.0.0.1')

  extend(process.env, env)
  subprocess = childProcess.spawn('python', ['server.py'], {
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

const isRunning: IpcIsIndexTTSRunning = () => !isDead

export function quit() {
  if (subprocess) {
    subprocess.kill()
  }
}

let win: BrowserWindow | null = null

export function showWin() {
  if (win) {
    win.focus()
    return
  }
  win = window.create({
    name: 'indextts',
    minHeight: 850,
    minWidth: 1280,
    width: 1280,
    height: 850,
  })
  win.on('close', () => {
    win?.destroy()
    win = null
  })

  window.loadPage(win, { page: 'indextts' })
}

const initIpc = once(() => {
  handleEvent('getIndexTTSPort', getPort)
  handleEvent('isIndexTTSRunning', isRunning)
})
