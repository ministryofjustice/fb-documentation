'use strict'

const gulp = require('gulp')
const sasslint = require('gulp-sass-lint')

// SCSS linting check
gulp.task('scss:lint', () => {
  return gulp.src('source/stylesheets/**/*.scss')
    .pipe(sasslint({
      configFile: 'config/.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
})
