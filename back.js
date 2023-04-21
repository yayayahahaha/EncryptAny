const zipper = require('zip-local')
const fs = require('fs')
const path = require('path')
const UglifyJS = require('uglify-js')

// TODO(flyc): 這裡會有 path 的問題? 讓整體流程與這個專案耦合太強
const utils = require('./utils.js')
const { BACK_JS_PATH, BACK_JS_COPY_DIST_PATH, generateEncAndIv, welcomeBack, ask } = utils

function _temp() {
  // Copy and uglify back.js to result-folder
  const uglifyOptions = { mangle: { toplevel: true } }
  fs.writeFileSync(
    BACK_JS_COPY_DIST_PATH,
    UglifyJS.minify(fs.readFileSync(BACK_JS_PATH, 'utf8'), uglifyOptions).code,
    'utf8'
  )
}
_temp

const RESULT_GOD_WORDS_PATH = path.resolve(__dirname, './god-words')
const ZIP_BACK_PATH = path.resolve(__dirname, './result.zip')
const FINAL_RESULT_PATH = path.resolve(__dirname, './result')

async function start() {
  // Read origin enc and iv
  const neverKnow = fs.readFileSync(RESULT_GOD_WORDS_PATH, 'utf8')
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
  fs.writeFileSync(ZIP_BACK_PATH, keepIt, 'hex')

  fs.mkdirSync(FINAL_RESULT_PATH, { recursive: true })
  zipper.sync.unzip(ZIP_BACK_PATH).save(FINAL_RESULT_PATH)

  console.log('\n\nWelcome back.\n')
}
start()
