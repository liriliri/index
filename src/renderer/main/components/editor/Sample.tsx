import { observer } from 'mobx-react-lite'
import LunaAudioPlayer from 'luna-audio-player/react'
import Style from './Sample.module.scss'

export default observer(function Sample() {
  return (
    <div className={Style.container}>
      <LunaAudioPlayer url="file:///Users/surunzi/project/liriliri/index/resources/sample.wav" />
    </div>
  )
})
