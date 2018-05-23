'use strict'

const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')

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

// This helper allows objects to be updated
exports.setObject = (...args) => {
  const objArgs = args.slice()
  objArgs.unshift({})
  return Object.assign.apply(null, objArgs)
}
// This helper allows object properties to be updated individually
exports.setObjectProperty = (obj, prop, val) => {
  return Object.assign({}, obj, {[prop]: val})
}

// helper functions to paper over model inconsitencies
exports.setError = data => {
  if (data.error) {
    data.errorMessage = {
      html: data.error
    }
  }
  return data
}

exports.setLabel = data => {
  if (data.label && !data.label.html) {
    data.label = {
      html: data.label
    }
  }
  if (data.hint && !data.hint.html) {
    data.hint = {
      html: data.hint
    }
  }
  return data
}

// classes: params.fieldset.classes,
// attributes: params.fieldset.attributes,
exports.setItemsLabel = data => {
  if (data.label) {
    data.legend = data.label.html || data.label
  }
  if (data.hint && !data.hint.html) {
    data.hint = {
      html: data.hint
    }
  }
  if (data.legend) {
    data.fieldset = Object.assign({}, data.fieldset, {
      legend: {
        html: data.legend
      },
      hint: data.hint
    })
  }
  if (data.error) {
    data.fieldset.errorMessage = {
      html: data.error
    }
  }
  data = Object.assign(data, data.fieldset)
  data.items = data.items || []
  data.items = data.items.map(item => {
    return Object.assign({}, item, {
      text: item.text ? item.text : item.label
    })
  })
  return data
}

exports.setContent = (data, prop) => {
  prop = prop || 'html'
  if (data[prop]) {
    data[prop] = markdown.render(data[prop]).body
  }
  return data
}

const handleWidthClass = (data, prop, def) => {
  if (!data[prop] && def) {
    data[prop] = def
  }
  if (!data[prop]) {
    return data
  }
  const widthDelimiter = (parseInt(data[prop], 10) > 0) ? 'c-input--width' : '!-width'
  data.classes = data.classes ? data.classes + ' ' : ''
  data.classes +=  `govuk-${widthDelimiter}-${data[prop]}`
  return data
}

// Handle width classes
exports.setWidthClass = (data, def) => {
  return handleWidthClass(data, 'widthClass', def)
}
exports.setInputWidthClass = (data, def) => {
  return handleWidthClass(data, 'widthClassInput', def)
}

// This helper allows object properties to be updated individually
exports.JSON = (obj) => {
  return `<pre>${JSON.stringify(obj, null, 2)}</pre>`
}
