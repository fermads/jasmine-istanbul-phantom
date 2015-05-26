var fs = require('fs')

function extend(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor
    && source[property].constructor === Object) {
      destination[property] = destination[property] || {}
      extend(destination[property], source[property])
    }
    else {
      destination[property] = source[property]
    }
  }
  return destination
}

function isDirectory(dir) {
  var stat

  try {
    stat = fs.statSync(dir)
  }
  catch(e) {
    return false
  }

  return stat.isDirectory() ? true : false
}

function isFile(file) {
  var stat

  try {
    stat = fs.statSync(file)
  }
  catch(e) {
    return false
  }

  return stat.isFile() ? true : false
}

module.exports = {
  isDirectory: isDirectory,
  isFile: isFile,
  extend: extend
}