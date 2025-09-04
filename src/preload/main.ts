import { IpcGetStore, IpcSetStore } from 'share/common/types'
import { IpcGetIndexTTSPort, IpcIsIndexTTSRunning } from '../common/types'
import mainObj from 'share/preload/main'
import { invoke } from 'share/preload/util'

export default Object.assign(mainObj, {
  getIndexTTSPort: invoke<IpcGetIndexTTSPort>('getIndexTTSPort'),
  isIndexTTSRunning: invoke<IpcIsIndexTTSRunning>('isIndexTTSRunning'),
  getSettingsStore: invoke<IpcGetStore>('getSettingsStore'),
  setSettingsStore: invoke<IpcSetStore>('setSettingsStore'),
})
