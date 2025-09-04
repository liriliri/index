import * as window from 'share/main/lib/window'

export function showWin() {
  const win = window.create({
    name: 'main',
    minWidth: 1280,
    minHeight: 850,
    width: 1280,
    height: 850,
    menu: true,
  })

  window.loadPage(win)
}
