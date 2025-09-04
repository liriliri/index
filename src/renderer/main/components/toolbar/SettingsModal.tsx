import LunaModal from 'luna-modal/react'
import LunaSetting, {
  LunaSettingButton,
  LunaSettingSelect,
  LunaSettingTitle,
} from 'luna-setting/react'
import { notify } from 'share/renderer/lib/util'
import { t } from '../../../../common/util'
import Style from './SettingsModal.module.scss'
import { createPortal } from 'react-dom'
import { observer } from 'mobx-react-lite'
import contain from 'licia/contain'
import debounce from 'licia/debounce'
import store from '../../store'
import { IModalProps } from 'share/common/types'

const notifyRequireReload = debounce(() => {
  notify(t('requireReload'), { icon: 'info' })
}, 1000)

export default observer(function SettingsModal(props: IModalProps) {
  function onChange(key, val) {
    if (contain(['language', 'useNativeTitlebar'], key)) {
      notifyRequireReload()
    }
    store.settings.set(key, val)
  }

  return createPortal(
    <LunaModal
      title={t('settings')}
      width={400}
      visible={props.visible}
      onClose={props.onClose}
    >
      <LunaSetting className={Style.settings} onChange={onChange}>
        <LunaSettingTitle title={t('appearance')} />
        <LunaSettingSelect
          keyName="theme"
          value={store.settings.theme}
          title={t('theme')}
          options={{
            [t('sysPreference')]: 'system',
            [t('light')]: 'light',
            [t('dark')]: 'dark',
          }}
        />
        <LunaSettingSelect
          keyName="language"
          value={store.settings.language}
          title={t('language')}
          options={{
            [t('sysPreference')]: 'system',
            English: 'en-US',
            ['中文']: 'zh-CN',
          }}
        />
        <LunaSettingButton
          description={t('restartIndex')}
          onClick={() => main.relaunch()}
        />
      </LunaSetting>
    </LunaModal>,
    document.body
  )
})
