const zipper = require('zip-local')
const fs = require('fs')

const utils = require('./utils.js')
const { godWordsPath, generateEncAndIv, welcomeBack, ask, resultFilePath, ERROR_CODE } = utils

function showDecryptSteps() {
  console.log()
  console.log('==== Decrypt Steps ====')
  console.log('Put encrypted file `god-words` into the same folder.')
  console.log('Run script')
  console.log('Input the password you set before')
  console.log('Wait a minute, it dependents on the size of file')
  console.log('When it done, it will generate a folder named `result` and a zip file name `result.zip`')
  console.log('The original files will be in the `result` folder.')
  console.log('=======================')
  console.log()
}

async function start(showHints = true) {
  showHints && showDecryptSteps()

  if (!fs.existsSync(godWordsPath())) {
    console.error(ERROR_CODE.title)
    console.error(ERROR_CODE[2])
    return void process.exit(2)
  }

  // Read origin enc and iv
  const neverKnow = fs.readFileSync(godWordsPath(), 'utf8')
  const assetsEnc = neverKnow.slice(0, 32)
  const assetsIv = neverKnow.slice(32, 48)
  const godWords = neverKnow.slice(48)

  // Use password generate real enc and iv
  const password = await ask('Password: ')
  const { enc: backEnc, iv: backIv } = generateEncAndIv(password, { basicEncKey: assetsEnc, basicIv: assetsIv })

  // Falling
  const keepIt = await welcomeBack(godWords, backEnc, backIv).catch(() => null)
  if (keepIt == null) {
    return void start(false)
  }

  // Write them back, welcome back
  fs.writeFileSync(`${resultFilePath()}.zip`, keepIt, 'hex')

  fs.mkdirSync(resultFilePath(), { recursive: true })
  zipper.sync.unzip(`${resultFilePath()}.zip`).save(resultFilePath())

  console.log('Decrypt Success.')

  console.log('\n\nWelcome back.\n')
}
start()
