import { BrowserWindow } from 'electron'
import once from 'licia/once'
import { getSettingsStore } from '../lib/store'
import { IpcGetStore, IpcSetStore } from 'share/common/types'
import { handleEvent } from 'share/main/lib/util'
import * as window from 'share/main/lib/window'

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
  handleEvent('setSettingsStore', <IpcSetStore>((name, val) => {
    settingsStore.set(name, val)
  }))
  handleEvent('getSettingsStore', <IpcGetStore>(
    ((name) => settingsStore.get(name))
  ))
})
