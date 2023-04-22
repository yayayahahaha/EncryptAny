const zipper = require('zip-local')
const fs = require('fs')

const utils = require('./utils')
const { targetFolderPath, resultGodWordsPath, ask, becomeGod, generateEncAndIv, ERROR_CODE } = utils

function showEncryptSteps() {
  console.log()
  console.log('==== Encrypt Steps ====')
  console.log('Put all files you want to encrypt into a folder named `original-files`.')
  console.log('Set a password for it.')
  console.log('Wait a minute, it depends on the size of files.')
  console.log('When it done, it will generate a file named `god-words`')
  console.log('Keep it safe, and use `EncryptAnyBack` program to decrypt it back.')
  console.log('=======================')
  console.log()
}

async function start(showHints = true) {
  showHints && showEncryptSteps()

  if (!fs.existsSync(targetFolderPath()) || !fs.lstatSync(targetFolderPath()).isDirectory()) {
    console.error(ERROR_CODE.title)
    console.error(ERROR_CODE[1])
    return void process.exit(1)
  }

  const password = await ask('Your password: ').catch(() => null)
  if (password == null) return void process.exit(0)
  console.log()
  const passwordCheck = await ask('Again for confirm: ').catch(() => null)
  if (passwordCheck == null) return void process.exit(0)
  console.log()
  console.log()
  if (password !== passwordCheck) {
    console.error(ERROR_CODE.title)
    console.error(ERROR_CODE[5])
    return void start(false)
  }

  const zipMemory = zipper.sync.zip(targetFolderPath()).compress().memory().toString('hex')
  const target = zipMemory

  // Become God and save it to result-folder
  const { enc, iv, basicEncKey, basicIv } = generateEncAndIv(password)
  const godWords = await becomeGod(target, enc, iv)

  // Crerate needed assets
  const assets = `${basicEncKey}${basicIv}${godWords}`
  fs.writeFileSync(resultGodWordsPath(), assets, 'utf8')

  console.log('Encrypt Success.')
  console.log('\n\nOnly God knows now.\n')
}
start()

// Reference:
// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
// https://stackoverflow.com/a/51592970/4551134
// https://blog.logrocket.com/using-stdout-stdin-stderr-node-js/
// https://github.com/npm/read
// https://github.com/vercel/pkg/issues/1293
