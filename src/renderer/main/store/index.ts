import { action, makeObservable, observable, runInAction } from 'mobx'
import BaseStore from 'share/renderer/store/BaseStore'
import * as indexTTS from '../../lib/indextts'
import LunaModal from 'luna-modal'
import { t } from '../../../common/util'
import { Settings } from './settings'
import { setMainStore } from '../../lib/util'

interface ISample {
  url: string
  name: string
}

class Store extends BaseStore {
  isIndexTTSReady = false
  isIndexTTSErr = false
  sidebarWeight = 30
  audioWeight = 30
  text = ''
  sample: ISample = { url: '', name: t('sampleTip') }
  settings = new Settings()
  constructor() {
    super()

    makeObservable(this, {
      isIndexTTSErr: observable,
      isIndexTTSReady: observable,
      sidebarWeight: observable,
      audioWeight: observable,
      text: observable,
      setText: action,
    })

    this.init()
  }
  setText(text: string) {
    this.text = text

    setMainStore('text', text)
  }
  async init() {
    const text = await main.getMainStore('text')
    if (text) {
      runInAction(() => {
        this.text = text
      })
    }

    const ready = await indexTTS.wait()
    if (ready) {
      runInAction(() => {
        this.isIndexTTSReady = true
      })
    } else {
      this.showIndexTTSErr()
    }
  }
  private showIndexTTSErr = async () => {
    runInAction(() => {
      this.isIndexTTSReady = false
      this.isIndexTTSErr = true
    })
    const result = await LunaModal.confirm(t('indexTTSErrConfirm'))
    if (result) {
      main.showTerminal()
    }
  }
}

export default new Store()
