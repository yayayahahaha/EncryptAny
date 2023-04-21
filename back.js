const zipper = require('zip-local')
const fs = require('fs')

const utils = require('./utils.js')
const { godWordsPath, generateEncAndIv, welcomeBack, ask, resultFilePath, ERROR_CODE } = utils

async function start() {
  if (!fs.existsSync(godWordsPath())) {
    console.error(ERROR_CODE[2])
    return process.exit(2)
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
  if (keepIt == null) return process.exit(2)

  // Write them back, welcome back
  fs.writeFileSync(`${resultFilePath()}.zip`, keepIt, 'hex')

  fs.mkdirSync(resultFilePath(), { recursive: true })
  zipper.sync.unzip(`${resultFilePath()}.zip`).save(resultFilePath())

  console.log('\n\nWelcome back.\n')
}
start()
