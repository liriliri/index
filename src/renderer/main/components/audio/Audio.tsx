import Style from './Audio.module.scss'
import { t } from '../../../../common/util'
import store from '../../store'
import map from 'licia/map'
import LunaAudioPlayer from 'luna-audio-player/react'
import fileUrl from 'licia/fileUrl'
import isEmpty from 'licia/isEmpty'
import { observer } from 'mobx-react-lite'
import { colorPrimary, colorPrimaryDark } from '../../../../common/theme'
import each from 'licia/each'
import { TaskStatus } from '../../store/task'
import { LoadingBar } from 'share/renderer/components/loading'

export default observer(function Audio() {
  const progressColor = store.theme === 'dark' ? colorPrimaryDark : colorPrimary

  const audios = map(store.audios, (audio) => {
    return (
      <LunaAudioPlayer
        key={audio.path}
        name={audio.text}
        waveHeight={30}
        progressColor={progressColor}
        url={fileUrl(audio.path)}
      />
    )
  })

  each(store.tasks, (task) => {
    audios.push(
      <div className={Style.task} key={task.id}>
        <div className={Style.taskStatus}>
          {task.status === TaskStatus.Generating && <LoadingBar />}
        </div>
        <div className={Style.taskText}>{task.text}</div>
      </div>
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
