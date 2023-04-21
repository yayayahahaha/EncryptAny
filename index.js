const crypto = require('crypto')
const zipper = require('zip-local')
const fs = require('fs')
const read = require('read')
const UglifyJS = require('uglify-js')

function ask(question) {
  return read({ prompt: question, silent: true })
}

const cipherType = 'aes-256-cbc'
const TARGET_FOLDER_PATH = './target-folder'
const RESULT_FOLDER_PATH = './result-folder'
const RESULT_GOD_WORDS_PATH = `${RESULT_FOLDER_PATH}/god-words`
const BACK_JS_NAME = 'back.js'
const BACK_JS_PATH = `./${BACK_JS_NAME}`
const BACK_JS_COPY_DIST_PATH = `${RESULT_FOLDER_PATH}/${BACK_JS_NAME}`

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

  const zipMemory = zipper.sync.zip(TARGET_FOLDER_PATH).compress().memory().toString('hex')
  const target = zipMemory

  // Become God and save it to result-folder
  const { enc, iv, basicEncKey, basicIv } = generateEncAndIv(password)
  const godWords = await becomeGod(target, enc, iv)

  // Crerate needed assets
  const assets = `${basicEncKey}${basicIv}${godWords}`
  fs.writeFileSync(RESULT_GOD_WORDS_PATH, assets, 'utf8')

  // Copy and uglify back.js to result-folder
  const uglifyOptions = { mangle: { toplevel: true } }
  fs.writeFileSync(
    BACK_JS_COPY_DIST_PATH,
    UglifyJS.minify(fs.readFileSync(BACK_JS_PATH, 'utf8'), uglifyOptions).code,
    'utf8'
  )

  console.log('\n\nOnly God knows.\n')
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
