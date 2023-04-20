const crypto = require('crypto')
const zipper = require('zip-local')
const fs = require('fs')
const read = require('read')

function ask(question) {
  return read({ prompt: question, silent: false })
}

const cipherType = 'aes-256-cbc'
const TARGET_FOLDER_PATH = './target-folder'
const RESULT_FOLDER_PATH = './result-folder'
const RESULT_CONTEXT_PATH = `${RESULT_FOLDER_PATH}/context.txt`
const RESULT_ASSETS_PATH = `${RESULT_FOLDER_PATH}/assets.json`
const ZIP_NAME = 'temp.zip'

const ERROR_CODE = {
  1: `${TARGET_FOLDER_PATH} is not a folder.`,
}

test // Avoid eslint error
function test() {
  const a = Array(32).fill('a').join('')
  const b = Array(16).fill('b').join('')
  becomeGod('how do you do', a, b)
    .then((res) => {
      console.log(res)
      return welcomeBack(res, a, b)
    })
    .then((res) => {
      console.log(res)
    })
}

async function start() {
  if (!fs.lstatSync(TARGET_FOLDER_PATH).isDirectory()) {
    console.error(ERROR_CODE[1])
    return void process.exit(1)
  }

  const password = await ask('Your password: ')

  zipper.sync.zip(TARGET_FOLDER_PATH).compress().save(ZIP_NAME)
  const target = fs.readFileSync(ZIP_NAME, 'hex').toString()

  const { enc, iv, basicEncKey, basicIv } = generateEncAndIv(password)
  const godWords = await becomeGod(target, enc, iv)
  fs.writeFileSync(RESULT_CONTEXT_PATH, godWords, 'utf8')

  const assets = { enc: basicEncKey, iv: basicIv }
  fs.writeFileSync(RESULT_ASSETS_PATH, JSON.stringify(assets), 'utf8')
}
start()

/**
 * @function becomeGod
 * @description TODO
 * */
function becomeGod(target, enc, iv) {
  return new Promise((resolve, reject) => {
    try {
      const cipher = crypto.createCipheriv(cipherType, enc, iv)
      return void resolve(cipher.update(target, 'utf8', 'hex') + cipher.final('hex'))
    } catch (error) {
      console.error('Encrypt failed')
      return void reject(error)
    }
  })
}

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
      console.error('Decrypt failed')
      return void reject(error)
    }
  })
}

function generateEncAndIv(password, { basicEncKey: rawEnc, basicIv: rawIv } = {}) {
  const basicEncKey = rawEnc || crypto.randomBytes(32).toString('hex').slice(0, 32)
  const basicIv = rawIv || crypto.randomBytes(32).toString('hex').slice(0, 16)
  const { enc, iv } = _generateEncAndIvByRandom(password)
  return { enc, iv, basicEncKey, basicIv }

  function _generateEncAndIvByRandom(target) {
    const cipher = crypto.createCipheriv(cipherType, basicEncKey, basicIv)
    const result = cipher.update(target, 'utf8', 'hex') + cipher.final('hex')
    const enc = result.slice(0, 32)
    const iv = result.split('').reverse().join('').slice(0, 16)
    return { enc, iv }
  }
}

// Reference:
// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
// https://stackoverflow.com/a/51592970/4551134
// https://blog.logrocket.com/using-stdout-stdin-stderr-node-js/
// https://github.com/npm/read
