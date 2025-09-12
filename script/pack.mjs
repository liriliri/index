import builder from 'electron-builder'
import map from 'licia/map.js'
import stripIndent from 'licia/stripIndent.js'
import splitPath from 'licia/splitPath.js'
import isWindows from 'licia/isWindows.js'
import { hashFile } from './util.mjs'
import path from 'path'

cd('dist')

const pkg = await fs.readJson('package.json')

const ignoreSitePackages = map([], (item) => {
  return `!**/site-packages/{${item},${item}-*-info}`
})

const config = {
  appId: pkg.appId,
  directories: {
    output: `../release/${pkg.version}`,
  },
  files: ['main', 'preload', 'renderer', 'indextts', ...ignoreSitePackages],
  asarUnpack: ['indextts/**/*'],
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  win: {
    target: [
      {
        target: '7z',
      },
    ],
  },
  mac: {
    electronLanguages: ['zh_CN', 'en'],
    identity: null,
    target: [
      {
        target: 'dmg',
      },
    ],
  },
  publish: {
    provider: 'generic',
    url: 'https://release.liriliri.io/index/',
    channel: '${productName}-latest',
  },
}

const artifacts = await builder.build({
  config,
})

if (isWindows) {
  const artifact = artifacts[0]
  const { name, dir } = splitPath(artifact)
  const { size } = await fs.stat(artifact)
  const sha512 = await hashFile(artifact)
  const content = stripIndent`version: ${pkg.version}
    files:
      - url: ${name}
        sha512: ${sha512}
        size: ${size}
    path: ${name} 
    sha512: ${sha512}
    releaseDate: '${new Date().toISOString()}'`
  await fs.writeFile(
    path.resolve(dir, `${pkg.productName}-latest.yml`),
    content
  )
}
