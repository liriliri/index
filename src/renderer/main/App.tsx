import Toolbar from './components/toolbar/Toolbar'
import Statusbar from './components/statusbar/Statusbar'
import Style from './App.module.scss'
import LunaSplitPane, { LunaSplitPaneItem } from 'luna-split-pane/react'
import Editor from './components/editor/Editor'
import Audio from './components/audio/Audio'
import store from './store'

export default function App() {
  return (
    <>
      <Toolbar />
      <div className={Style.workspace}>
        <LunaSplitPane direction="vertical">
          <LunaSplitPaneItem weight={100 - store.audioWeight}>
            <Editor />
          </LunaSplitPaneItem>
          <LunaSplitPaneItem className={Style.audio} weight={store.audioWeight}>
            <Audio />
          </LunaSplitPaneItem>
        </LunaSplitPane>
      </div>
      <Statusbar />
    </>
  )
}
