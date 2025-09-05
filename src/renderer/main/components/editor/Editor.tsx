import LunaSplitPane, { LunaSplitPaneItem } from 'luna-split-pane/react'
import Sidebar from './Sidebar'
import Style from './Editor.module.scss'
import store from '../../store'
import { t } from '../../../../common/util'
import { observer } from 'mobx-react-lite'

export default observer(function Editor() {
  return (
    <LunaSplitPane>
      <LunaSplitPaneItem
        className={Style.text}
        weight={100 - store.sidebarWeight}
        minSize={400}
      >
        <textarea
          placeholder={t('enterText')}
          value={store.text}
          onChange={(e) => {
            console.log(e.target.value)
            store.setText(e.target.value)
          }}
        />
      </LunaSplitPaneItem>
      <LunaSplitPaneItem
        className={Style.sidebar}
        weight={store.sidebarWeight}
        minSize={350}
      >
        <Sidebar />
      </LunaSplitPaneItem>
    </LunaSplitPane>
  )
})
