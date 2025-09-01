import { makeObservable, observable, runInAction } from 'mobx'
import BaseStore from 'share/renderer/store/BaseStore'
import * as indexTTS from '../lib/indextts'
import LunaModal from 'luna-modal'
import { t } from '../../common/util'

class Store extends BaseStore {
  isIndexTTSReady = false
  isIndexTTSErr = false
  constructor() {
    super()

    makeObservable(this, {
      isIndexTTSErr: observable,
      isIndexTTSReady: observable,
    })

    this.init()
  }
  async init() {
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
