import { makeObservable, observable, runInAction } from 'mobx'
import BaseStore from 'share/renderer/store/BaseStore'
import * as indextts from '../lib/indextts'

class Store extends BaseStore {
  isIndexTTSReady = false
  isIndexTTSErr = false
  indexTTSUrl = ''
  constructor() {
    super()

    makeObservable(this, {
      isIndexTTSErr: observable,
      isIndexTTSReady: observable,
    })

    this.init()
  }
  async init() {
    const indexTTSPort = await main.getIndexTTSPort()
    this.indexTTSUrl = `http://127.0.0.1:${indexTTSPort}`

    const ready = await indextts.wait()
    if (ready) {
      runInAction(() => {
        this.isIndexTTSReady = true
      })
    } else {
      runInAction(() => {
        this.isIndexTTSErr = true
      })
    }
  }
}

export default new Store()
