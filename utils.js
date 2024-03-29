const crypto = require('crypto')
const read = require('read')
const path = require('path')

const cipherType = 'aes-256-cbc'
const TARGET_FOLDER_NAME = 'original-files'
const RESULT_FOLDER_NAME = 'encrypted-result'
const GOD_WORDS_NAME = 'god-words'
const ZIP_NAME = 'result'

const ERROR_CODE = {
  title: `[ERROR]`,
  1: `original-files check failed! ${targetFolderPath()} is not a folder.\n`,
  2: `god-words check failed! ${godWordsPath()} is not exist.\n`,
  3: '\n\nYOU SHALL NOT PASS\nPlease try again.\n',
  4: 'Encrypt failed\n',
  5: 'Two passwords are not the same, please check again.\n',
}

function targetFolderPath() {
  return path.resolve(TARGET_FOLDER_NAME)
}
function resultGodWordsPath() {
  return path.resolve(GOD_WORDS_NAME)
}
function godWordsPath() {
  return path.resolve(GOD_WORDS_NAME)
}
function resultFilePath() {
  return path.resolve(ZIP_NAME)
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
      console.error(ERROR_CODE.title)
      console.error(ERROR_CODE[4])
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
      console.error(ERROR_CODE[3])
      return void reject(error)
    }
  })
}

module.exports = {
  cipherType,

  RESULT_FOLDER_NAME,
  TARGET_FOLDER_NAME,
  GOD_WORDS_NAME,

  ERROR_CODE,

  targetFolderPath,
  resultGodWordsPath,
  godWordsPath,
  resultFilePath,

  ask,

  generateEncAndIv,
  becomeGod,
  welcomeBack,
}
