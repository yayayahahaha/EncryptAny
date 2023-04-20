const crypto = require('crypto')
const cipherType = 'aes-256-cbc'

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

function letsGo(target, password) {
  const basicEncKey = crypto.randomBytes(32).toString('hex').slice(0, 32)
  const basicIv = crypto.randomBytes(32).toString('hex').slice(0, 16)
  function generateEncAndIv(target) {
    const cipher = crypto.createCipheriv(cipherType, basicEncKey, basicIv)
    const result = cipher.update(target, 'utf8', 'hex') + cipher.final('hex')
    const enc = result.slice(0, 32)
    const iv = result.split('').reverse().join('').slice(0, 16)
    return { enc, iv }
  }
  const { enc, iv } = generateEncAndIv(password)

  becomeGod(target, enc, iv)
    .then((godWords) => {
      console.log('godWords:', godWords)
      return welcomeBack(godWords, enc, iv)
    })
    .then((onlyHuman) => {
      console.log('onlyHuman:', onlyHuman)
    })
    .catch((error) => {
      console.error(error.message || JSON.stringify(error, null, 2))
    })
}

const target = 'hello, kyoko and sayaka'
const password = 'my name is password'
letsGo(target, password)

// Reference: https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
