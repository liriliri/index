import Sample from './Sample'
import Style from './Sidebar.module.scss'
import className from 'licia/className'
import { t } from '../../../../common/util'
import store from '../../store'

export default function Sidebar() {
  return (
    <div className={Style.container}>
      <Sample />
      <div
        className={className(Style.generate, 'button', 'primary')}
        onClick={store.createTask}
      >
        {t('generate')}
      </div>
    </div>
  )
}
