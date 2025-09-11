import { action, makeObservable, observable, runInAction } from 'mobx'
import BaseStore from 'share/renderer/store/BaseStore'
import * as indextts from '../../lib/indextts'
import LunaModal from 'luna-modal'
import { t } from '../../../common/util'
import { Settings } from './settings'
import { setMainStore } from '../../lib/util'
import splitPath from 'licia/splitPath'
import { Task, TaskStatus } from './task'
import convertBin from 'licia/convertBin'
import { notify } from 'share/renderer/lib/util'
import strWidth from 'licia/strWidth'

interface ISample {
  path: string
  name: string
  audio?: Blob
}

interface IAudio {
  path: string
  text: string
}

export enum InferMode {
  Auto = 'auto',
  Normal = 'normal',
  Fast = 'fast',
}

class Store extends BaseStore {
  isIndexTTSReady = false
  isIndexTTSErr = false
  sidebarWeight = 30
  audioWeight = 30
  text = ''
  tasks: Task[] = []
  sample: ISample = { path: '', name: t('sampleTip') }
  inferMode: InferMode = InferMode.Normal
  audios: IAudio[] = []
  settings = new Settings()
  constructor() {
    super()

    makeObservable(this, {
      isIndexTTSErr: observable,
      isIndexTTSReady: observable,
      sidebarWeight: observable,
      audioWeight: observable,
      text: observable,
      sample: observable,
      audios: observable,
      tasks: observable,
      inferMode: observable,
      setText: action,
      setSample: action,
    })

    this.init()
  }
  setSample(path: string) {
    this.sample = {
      path,
      name: splitPath(path).name,
    }

    setMainStore('sample', path)
  }
  setInferMode(mode: InferMode) {
    this.inferMode = mode

    setMainStore('inferMode', mode)
  }
  setText(text: string) {
    this.text = text

    setMainStore('text', text)
  }
  createTask = async () => {
    const { sample, text } = this

    let audio = sample.audio
    if (!audio) {
      audio = convertBin(await node.readFile(sample.path), 'Blob') as Blob
      sample.audio = audio
    }
    let inferMode: 'normal' | 'fast' = 'normal'
    if (this.inferMode === InferMode.Fast) {
      inferMode = 'fast'
    } else if (this.inferMode === InferMode.Auto) {
      if (strWidth(text) > 100) {
        inferMode = 'fast'
      }
    }
    const task = new Task(text, audio, {
      inferMode,
      outputDir: '/Users/surunzi/Desktop',
    })
    runInAction(() => {
      this.tasks = [...this.tasks, task]
    })
    this.doCreateTask()
  }
  doCreateTask() {
    if (!this.isIndexTTSReady) {
      return
    }

    const task = this.tasks[0]
    if (task) {
      switch (task.status) {
        case TaskStatus.Success:
        case TaskStatus.Fail:
          this.tasks.shift()
          this.doCreateTask()
          break
        case TaskStatus.Wait:
          task.on('success', (text, output) => {
            this.audios = [
              ...this.audios,
              {
                text,
                path: output,
              },
            ]
            this.doCreateTask()
          })
          task.on('fail', () => {
            notify(t('generateErr'), { icon: 'error' })
            this.doCreateTask()
          })
          task.run()
          break
        case TaskStatus.Generating:
          break
      }
    }
  }
  async init() {
    const text = await main.getMainStore('text')
    const inferMode = await main.getMainStore('inferMode')
    runInAction(() => {
      if (text) {
        this.text = text
      }
      if (inferMode) {
        this.inferMode = inferMode
      }
    })

    const sample = await main.getMainStore('sample')
    if (sample && node.existsSync(sample)) {
      runInAction(() => {
        this.sample = {
          path: sample,
          name: splitPath(sample).name,
        }
      })
    } else {
      const defaultSample = await main.resolveResources('sample.wav')
      runInAction(() => {
        this.sample = {
          path: defaultSample,
          name: t('sampleTip'),
        }
      })
    }

    const ready = await indextts.wait()
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
