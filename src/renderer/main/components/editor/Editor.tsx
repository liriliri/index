import LunaSplitPane, { LunaSplitPaneItem } from 'luna-split-pane/react'
import Sidebar from './Sidebar'
import Style from './Editor.module.scss'
import store from '../../store'
import { t } from '../../../../common/util'

export default function Editor() {
  return (
    <LunaSplitPane>
      <LunaSplitPaneItem
        className={Style.text}
        weight={100 - store.sidebarWeight}
      >
        <textarea placeholder={t('enterText')} />
      </LunaSplitPaneItem>
      <LunaSplitPaneItem className={Style.sidebar} weight={store.sidebarWeight}>
        <Sidebar />
      </LunaSplitPaneItem>
    </LunaSplitPane>
  )
}
