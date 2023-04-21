const zipper = require('zip-local')
const fs = require('fs')

const utils = require('./utils')
const { targetFolderPath, resultFolderPath, resultGodWordsPath, ask, becomeGod, generateEncAndIv, ERROR_CODE } = utils

async function start() {
  if (!fs.existsSync(targetFolderPath()) || !fs.lstatSync(targetFolderPath()).isDirectory()) {
    console.error(ERROR_CODE[1])
    console.log('path: ', targetFolderPath())
    return void process.exit(1)
  }

  const password = await ask('Your password: ')

  const zipMemory = zipper.sync.zip(targetFolderPath()).compress().memory().toString('hex')
  const target = zipMemory

  // Become God and save it to result-folder
  const { enc, iv, basicEncKey, basicIv } = generateEncAndIv(password)
  const godWords = await becomeGod(target, enc, iv)

  // Crerate needed assets
  fs.mkdirSync(resultFolderPath(), { recursive: true })
  const assets = `${basicEncKey}${basicIv}${godWords}`
  fs.writeFileSync(resultGodWordsPath(), assets, 'utf8')

  console.log('\n\nOnly God knows.\n')
}
start()

// Reference:
// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
// https://stackoverflow.com/a/51592970/4551134
// https://blog.logrocket.com/using-stdout-stdin-stderr-node-js/
// https://github.com/npm/read
// https://github.com/vercel/pkg/issues/1293
