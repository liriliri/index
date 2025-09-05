import Style from './Audio.module.scss'
import { t } from '../../../../common/util'

export default function Audio() {
  return (
    <div className={Style.container}>
      <div className={Style.noAudios}>{t('noAudios')}</div>
    </div>
  )
}
