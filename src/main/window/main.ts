import { BrowserWindow } from 'electron'
import once from 'licia/once'
import { getMainStore, getSettingsStore } from '../lib/store'
import { IpcGetStore, IpcSetStore } from 'share/common/types'
import { handleEvent } from 'share/main/lib/util'
import * as window from 'share/main/lib/window'
import * as indextts from './indextts'

const store = getMainStore()
const settingsStore = getSettingsStore()

let win: BrowserWindow | null = null

export function showWin() {
  if (win) {
    win.focus()
    return
  }

  initIpc()

  win = window.create({
    name: 'main',
    minWidth: 1280,
    minHeight: 850,
    width: 1280,
    height: 850,
    menu: true,
  })

  window.loadPage(win)
}

const initIpc = once(() => {
  handleEvent('setMainStore', <IpcSetStore>(
    ((name, val) => store.set(name, val))
  ))
  handleEvent('getMainStore', <IpcGetStore>((name) => store.get(name)))
  store.on('change', (name, val) => {
    window.sendAll('changeMainStore', name, val)
  })
  handleEvent('setSettingsStore', <IpcSetStore>((name, val) => {
    settingsStore.set(name, val)
  }))
  handleEvent('getSettingsStore', <IpcGetStore>(
    ((name) => settingsStore.get(name))
  ))
  handleEvent('showIndexTTS', () => indextts.showWin())
})
