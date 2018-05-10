;(function (global) {
  'use strict'
  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}
  var ClipboardJS = window.ClipboardJS

  // This module is dependent on /vendor/clipboard.js
  GOVUK.copy = {
    init: function (selector) {
      $(selector).parent().prepend('<a class="govuk-link app-link--copy" href="#copy" aria-live="assertive">Copy</a>')
      // Copy to clipboard
      try {
        new ClipboardJS('.app-link--copy', {
          target: function (trigger) {
            return trigger.nextElementSibling
          }
        }).on('success', function (e) {
          e.trigger.text = 'Copied'
          e.clearSelection()
          setTimeout(function () {
            e.trigger.text = 'Copy'
          }, 5000)
        })
      } catch (err) {
        if (err) {
          console.log(err.message)
        }
      }
    }
  }
  global.GOVUK = GOVUK
})(window); // eslint-disable-line semi
