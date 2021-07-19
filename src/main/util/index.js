module.exports.makeId = function (length) {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789'
  const first = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      result.push(first.charAt(Math.floor(Math.random() * charactersLength)))
      continue
    }
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}
