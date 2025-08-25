#!/usr/bin/env zx
import { execa } from 'execa'
import extend from 'licia/extend.js'
import isWindows from 'licia/isWindows.js'
import { resolve, getPlatform } from './util.mjs'

const platform = getPlatform()

async function main() {
  const appDir = resolve('index-tts')

  let PATH = process.env.PATH
  if (isWindows) {
    const binPath = resolve('installer_files/env')
    PATH = `${binPath};${PATH}`
  } else {
    const binPath = resolve('installer_files/env/bin')
    PATH = `${binPath}:${PATH}`
  }

  const env = {
    PATH,
  }

  await execa('pip', ['install', 'torch', 'torchaudio'], {
    cwd: appDir,
    stdio: 'inherit',
    env,
  })

  await execa('pip', ['install', '-e', '.[webui]', '--no-build-isolation'], {
    cwd: appDir,
    stdio: 'inherit',
    env,
  })
}

main()
