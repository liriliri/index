#!/usr/bin/env zx
import { execa } from 'execa'
import isWindows from 'licia/isWindows.js'
import { resolve, getPlatform } from './util.mjs'

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

  await execa('pip', ['install', 'uv'], {
    cwd: appDir,
    stdio: 'inherit',
    env,
  })

  await execa('uv', ['sync', '--all-extras'], {
    cwd: appDir,
    stdio: 'inherit',
    env,
  })
}

main()
