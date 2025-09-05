import { observer } from 'mobx-react-lite'
import LunaAudioPlayer from 'luna-audio-player/react'
import Style from './Sample.module.scss'
import LunaToolbar from 'luna-toolbar/react'
import ToolbarIcon from 'share/renderer/components/ToolbarIcon'
import { t } from '../../../../common/util'

export default observer(function Sample() {
  return (
    <div className={Style.container}>
      <LunaToolbar className={Style.toolbar}>
        <ToolbarIcon
          icon="open-file"
          title={t('openAudio')}
          onClick={() => {}}
        />
      </LunaToolbar>
      <LunaAudioPlayer url="file:///Users/surunzi/project/liriliri/index/resources/sample.wav" />
    </div>
  )
})
