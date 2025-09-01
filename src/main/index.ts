import { app } from 'electron'
import log from 'share/common/log'
import * as menu from './lib/menu'
import * as language from 'share/main/lib/language'
import * as theme from 'share/main/lib/theme'
import * as ipc from 'share/main/lib/ipc'
import * as indextts from './window/indextts'
import * as main from './window/main'
import * as terminal from 'share/main/window/terminal'
import { setupTitlebar } from 'custom-electron-titlebar/main'

const logger = log('main')
logger.info('start', process.argv)

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.setName('Index')

app.on('ready', () => {
  logger.info('app ready')

  setupTitlebar()
  language.init()
  theme.init()
  terminal.init()
  ipc.init()
  indextts.init()
  main.showWin()
  menu.init()
})
