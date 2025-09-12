import Style from './Statusbar.module.scss'
import className from 'licia/className'
import { t } from '../../../../common/util'

export default function Statusbar() {
  return (
    <div className={Style.container}>
      <div
        className={className(Style.item, Style.button)}
        title={t('terminal')}
        onClick={() => main.showTerminal()}
      >
        <span className="icon-terminal"></span>
      </div>
      <div
        className={className(Style.item, Style.button)}
        title={'Index TTS'}
        onClick={() => main.showIndexTTS()}
      >
        <span className="icon-web"></span>
      </div>
    </div>
  )
}
