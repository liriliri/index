import LunaToolbar, {
  LunaToolbarButton,
  LunaToolbarHtml,
  LunaToolbarSpace,
} from 'luna-toolbar/react'
import { t } from '../../../../common/util'
import { LoadingBar } from 'share/renderer/components/loading'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import Style from './Toolbar.module.scss'
import CopyButton from 'share/renderer/components/CopyButton'
import ToolbarIcon from 'share/renderer/components/ToolbarIcon'
import { useState } from 'react'
import SettingsModal from './SettingsModal'

export default observer(function Toolbar() {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  const loading = (
    <LunaToolbarHtml>
      {store.isIndexTTSReady || store.isIndexTTSErr ? null : (
        <LoadingBar
          className={Style.loading}
          onClick={() => {
            main.showTerminal()
          }}
        />
      )}
    </LunaToolbarHtml>
  )

  return (
    <>
      <LunaToolbar>
        <LunaToolbarButton onClick={() => {}}>
          <CopyButton className="toolbar-icon" onClick={() => {}} />
        </LunaToolbarButton>
        {loading}
        <LunaToolbarSpace />
        <ToolbarIcon
          icon="setting"
          title={t('settings')}
          onClick={() => setSettingsModalVisible(true)}
        />
      </LunaToolbar>
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => {
          setSettingsModalVisible(false)
        }}
      />
    </>
  )
})
