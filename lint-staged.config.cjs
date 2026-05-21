/* eslint-env node */
module.exports = {
  '*.{js,ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,json,md}': ['prettier --write'],
}
