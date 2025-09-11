import Emitter from 'licia/Emitter'
import uuid from 'licia/uuid'
import { makeObservable, observable, runInAction } from 'mobx'
import * as indextts from '../../lib/indextts'

export enum TaskStatus {
  Wait,
  Generating,
  Success,
  Fail,
}

export interface IInferOptions {
  output: string
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
  }
  async run() {
    const { options } = this

    try {
      const result = await indextts.infer(this.text, this.audio, {
        output: options.output,
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
