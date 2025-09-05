import { observer } from 'mobx-react-lite'
import LunaAudioPlayer from 'luna-audio-player/react'
import Style from './Sample.module.scss'
import LunaToolbar from 'luna-toolbar/react'
import ToolbarIcon from 'share/renderer/components/ToolbarIcon'
import { t } from '../../../../common/util'
import { colorPrimary, colorPrimaryDark } from '../../../../common/theme'
import store from '../../store'

export default observer(function Sample() {
  const progressColor = store.theme === 'dark' ? colorPrimaryDark : colorPrimary

  return (
    <div className={Style.container}>
      <LunaToolbar className={Style.toolbar}>
        <ToolbarIcon
          icon="open-file"
          title={t('openAudio')}
          onClick={() => {}}
        />
      </LunaToolbar>
      <LunaAudioPlayer
        progressColor={progressColor}
        name={store.sample.name}
        url={store.sample.url}
      />
    </div>
  )
})
