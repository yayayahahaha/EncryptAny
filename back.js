const crypto = require('crypto')
const zipper = require('zip-local')
const fs = require('fs')
const read = require('read')

function ask(question) {
  return read({ prompt: question, silent: true })
}

const cipherType = 'aes-256-cbc'
const RESULT_ASSETS_PATH = `./assets.json`
const ZIP_BACK_PATH = './result.zip'
const FINAL_RESULT_PATH = './result'

async function start() {
  // Read origin enc and iv
  const { enc: assetsEnc, iv: assetsIv, godWords } = JSON.parse(fs.readFileSync(RESULT_ASSETS_PATH, 'utf8'))

  // Use password generate real enc and iv
  const password = await ask('Password: ')
  const { enc: backEnc, iv: backIv } = generateEncAndIv(password, { basicEncKey: assetsEnc, basicIv: assetsIv })

  // Falling
  const keepIt = await welcomeBack(godWords, backEnc, backIv).catch(() => null)
  if (keepIt == null) return process.exit(2)

  // Write them back, welcome back
  fs.writeFileSync(ZIP_BACK_PATH, keepIt, 'hex')

  fs.mkdirSync(FINAL_RESULT_PATH, { recursive: true })
  zipper.sync.unzip(ZIP_BACK_PATH).save(FINAL_RESULT_PATH)

  console.log('\n\nWelcome back.\n')
}
start()

/**
 * @function welcomeBack
 * @description TODO
 * */
function welcomeBack(godWords, enc, iv) {
  return new Promise((resolve, reject) => {
    try {
      const decipher = crypto.createDecipheriv(cipherType, enc, iv)
      return void resolve(decipher.update(godWords, 'hex', 'utf8') + decipher.final('utf8'))
    } catch (error) {
      console.error('\n\nYOU SHALL NOT PASS\n')
      return void reject(error)
    }
  })
}

function generateEncAndIv(password, { basicEncKey, basicIv }) {
  const { enc, iv } = _generateEncAndIvByRandom(password)
  return { enc, iv }

  function _generateEncAndIvByRandom(target) {
    const cipher = crypto.createCipheriv(cipherType, basicEncKey, basicIv)
    const result = cipher.update(target, 'utf8', 'hex') + cipher.final('hex')
    const enc = result.slice(0, 32)
    const iv = result.split('').reverse().join('').slice(0, 16)
    return { enc, iv }
  }
}
