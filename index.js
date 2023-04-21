const zipper = require('zip-local')
const fs = require('fs')
const UglifyJS = require('uglify-js')
const path = require('path')

const utils = require(path.resolve(__dirname, './utils'))
const {
  ask,
  becomeGod,
  generateEncAndIv,
  TARGET_FOLDER_PATH,
  RESULT_GOD_WORDS_PATH,
  BACK_JS_PATH,
  BACK_JS_COPY_DIST_PATH,
  ERROR_CODE,
} = utils

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

// Reference:
// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
// https://stackoverflow.com/a/51592970/4551134
// https://blog.logrocket.com/using-stdout-stdin-stderr-node-js/
// https://github.com/npm/read
