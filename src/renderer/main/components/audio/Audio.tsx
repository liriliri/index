import Style from './Audio.module.scss'
import { t } from '../../../../common/util'
import store from '../../store'
import map from 'licia/map'
import LunaAudioPlayer from 'luna-audio-player/react'
import fileUrl from 'licia/fileUrl'
import isEmpty from 'licia/isEmpty'
import { observer } from 'mobx-react-lite'
import { colorPrimary, colorPrimaryDark } from '../../../../common/theme'

export default observer(function Audio() {
  const progressColor = store.theme === 'dark' ? colorPrimaryDark : colorPrimary

  const audios = map(store.audios, (audio) => {
    return (
      <LunaAudioPlayer
        key={audio.path}
        name={audio.text}
        progressColor={progressColor}
        url={fileUrl(audio.path)}
      />
    )
  })

  return (
    <div className={Style.container}>
      {isEmpty(audios) ? (
        <div className={Style.noAudios}>{t('noAudios')}</div>
      ) : (
        audios
      )}
    </div>
  )
})
