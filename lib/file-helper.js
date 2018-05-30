'use strict'

const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const {
  setObject,
  setObjectProperty,
  setError,
  setLabel,
  setItemsLabel,
  setContent,
  setWidthClass,
  setInputWidthClass
} = require('fb-nunjucks-helpers')

const markdown = require('jstransformer')(require('jstransformer-markdown'))
const beautify = require('js-beautify').html

// This helper function takes a path of a file and
// returns the contents as string
exports.getFileContents = path => {
  let fileContents
  try {
    fileContents = fs.readFileSync(path)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err.message)
    } else {
      throw err
    }
  }
  return fileContents.toString()
}

// This helper function takes a path of a *.md.njk file and
// returns the Nunjucks syntax inside that file without markdown data and imports
exports.getNunjucksCode = path => {
  let fileContents = this.getFileContents(path)

  let macro
  try {
    macro = fileContents.split('---')[2]
  } catch (err) {
    if (err) {
      console.log('Could not get Nunjucks code from ' + path)
    }
  }

  return macro
}

// This helper function takes a path of a *.md.njk file and
// returns the HTML rendered by Nunjucks without markdown data
exports.getHTMLCode = path => {
  let fileContents = this.getFileContents(path)

  let html
  try {
    html = nunjucks.renderString(fileContents.split('---')[2])
  } catch (err) {
    if (err) {
      console.log('Could not get HTML code from ' + path)
    }
  }

  return beautify(html.trim(), {
    indent_size: 2,
    end_with_newline: true,
    // If there are multiple blank lines, reduce down to one blank new line.
    max_preserve_newlines: 1
  })
}

// This helper function takes a path and
// returns the directories found under that path
exports.getDirectories = itemPath => {
  let files
  let directories
  try {
    files = fs.readdirSync(itemPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err.message)
    } else {
      throw err
    }
  }
  if (files) {
    directories = files.filter(filePath => fs.statSync(path.join(itemPath, filePath)).isDirectory())
  }
  return directories
}

// This helper function takes a path of a *.json file and
// returns its contents
exports.getJSONCode = path => {
  let fileContents = this.getFileContents(path)
  return fileContents
}

// helper functions allowing objects to be updated
exports.setObject = setObject
exports.setObjectProperty = setObjectProperty

// helper functions to paper over model inconsitencies
exports.setError = setError
exports.setLabel = setLabel
exports.setItemsLabel = setItemsLabel
exports.setContent = setContent
exports.setWidthClass = setWidthClass
exports.setInputWidthClass = setInputWidthClass

// This helper allows object properties to be updated individually
exports.JSON = (obj) => {
  return `<pre>${JSON.stringify(obj, null, 2)}</pre>`
}
