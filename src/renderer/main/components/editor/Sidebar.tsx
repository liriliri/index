import Sample from './Sample'
import Style from './Sidebar.module.scss'
import className from 'licia/className'
import { t } from '../../../../common/util'
import store, { InferMode } from '../../store'
import { Row, Select } from 'share/renderer/components/setting'
import { observer } from 'mobx-react-lite'

export default observer(function Sidebar() {
  return (
    <div className={Style.container}>
      <div className={Style.generateBasic}>
        <Sample />
        <div
          className={className(Style.generate, 'button', 'primary')}
          onClick={store.createTask}
        >
          {t('generate')}
        </div>
      </div>
      <div className={Style.generateOptions}>
        <Row>
          <Select
            value={store.inferMode}
            title={t('inferMode')}
            options={{
              [t('auto')]: InferMode.Auto,
              [t('normalInfer')]: InferMode.Normal,
              [t('batchInfer')]: InferMode.Fast,
            }}
            onChange={(val) => store.setInferMode(val as InferMode)}
          />
        </Row>
      </div>
    </div>
  )
})
