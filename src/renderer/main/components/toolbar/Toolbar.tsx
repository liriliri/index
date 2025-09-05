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
import copy from 'licia/copy'

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
          <CopyButton
            className="toolbar-icon"
            onClick={() => copy(store.text)}
          />
        </LunaToolbarButton>
        <ToolbarIcon
          icon="paste"
          title={t('paste')}
          onClick={async () => {
            const text = await navigator.clipboard.readText()
            store.setText(text)
          }}
        />
        <ToolbarIcon
          icon="eraser"
          title={t('clear')}
          onClick={() => store.setText('')}
        />
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
