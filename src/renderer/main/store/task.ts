import Emitter from 'licia/Emitter'
import uuid from 'licia/uuid'
import { makeObservable, observable, runInAction } from 'mobx'
import * as indextts from '../../lib/indextts'
import truncate from 'licia/truncate'
import dateFormat from 'licia/dateFormat'
import normalizePath from 'licia/normalizePath'
import filenamify from 'filenamify'

export enum TaskStatus {
  Wait,
  Generating,
  Success,
  Fail,
}

export interface IInferOptions {
  inferMode: 'normal' | 'fast'
  outputDir: string
}

export class Task extends Emitter {
  id = uuid()
  output = ''
  progress = 0
  status = TaskStatus.Wait
  text = ''
  audio: Blob
  options: IInferOptions
  constructor(text: string, audio: Blob, options: IInferOptions) {
    super()

    makeObservable(this, {
      output: observable,
      progress: observable,
      status: observable,
    })

    this.text = text
    this.audio = audio
    this.options = options
    let name = truncate(text, 100, {
      separator: ' ',
      ellipsis: '',
    })
    name = `${filenamify(name)}-${dateFormat('mmddHHMMss')}.wav`
    this.output = normalizePath(`${options.outputDir}/${name}`)
  }
  async run() {
    const { options } = this

    this.status = TaskStatus.Generating

    try {
      const result = await indextts.infer(this.text, this.audio, {
        output_path: this.output,
        infer_mode: options.inferMode,
      })
      runInAction(() => {
        this.progress = 100
        this.status = TaskStatus.Success
      })
      this.emit('success', this.text, result)
    } catch {
      this.status = TaskStatus.Fail
      this.emit('fail')
      return
    }
  }
}
