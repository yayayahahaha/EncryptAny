const crypto = require('crypto')
const read = require('read')
const path = require('path')

const cipherType = 'aes-256-cbc'
const TARGET_FOLDER_PATH = path.resolve(__dirname, './original-files')
const RESULT_FOLDER_PATH = path.resolve(__dirname, './encrypted-result')
const RESULT_GOD_WORDS_PATH = path.resolve(__dirname, `${RESULT_FOLDER_PATH}/god-words`)
const BACK_JS_NAME = 'back.js'
const BACK_JS_PATH = path.resolve(__dirname, `./${BACK_JS_NAME}`)
const BACK_JS_COPY_DIST_PATH = path.resolve(__dirname, `${RESULT_FOLDER_PATH}/${BACK_JS_NAME}`)

const ERROR_CODE = {
  1: `${TARGET_FOLDER_PATH} is not a folder.`,
}

/**
 * @function ask
 * @param {string} question
 * */
function ask(question) {
  return read({ prompt: question, silent: true })
}

/**
 * @function generateEncAndIv
 * */
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
      console.error('\n\nYOU SHALL NOT PASS\n')
      return void reject(error)
    }
  })
}

module.exports = {
  cipherType,
  TARGET_FOLDER_PATH,
  RESULT_FOLDER_PATH,
  RESULT_GOD_WORDS_PATH,
  BACK_JS_NAME,
  BACK_JS_PATH,
  BACK_JS_COPY_DIST_PATH,
  ERROR_CODE,

  ask,

  generateEncAndIv,
  becomeGod,
  welcomeBack,
}
