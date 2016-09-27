var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var run = require('gulp-run');
var foreach = require('gulp-foreach');
var pandoc = require('gulp-pandoc');
var pandocpdf = require('gulp-pandoc-pdf');
var markdownpdf = require('gulp-markdown-pdf');
var docco = require("gulp-docco");
var ghPages = require('gulp-gh-pages');


gulp.task('pdf', function() {
    gulp.src('./*.md')
                 .pipe(markdownpdf())
                 .pipe(gulp.dest('build/pdf'));
});

// gulp.task('html', function() {
//     gulp.src('./*.md')
//         .pipe(pandoc({
//             from: 'markdown',
//             to: 'html5',
//             ext: '.html',
//              args: ['-s', '-t revealjs', '-i', '-V theme:default']
//             // args: ['--smart']
//         }))
//         .pipe(gulp.dest('build/html'));
//         });

// gulp.task('build', ['pdf','doc']);


gulp.task('doc', function() {
  var options = {
    layout:     'parallel',
    output:     'docs',
    template:   'docs/template/docco.jst',
    css:        'docs/css/docco.css',
    extension:  null,
    languages:  {},
    marked:     null
  };
  return gulp.src("./*.md")
    .pipe(docco(options))
    .pipe(gulp.dest('./docs'));
});

gulp.task('deploy', function() {
  return gulp.src('./docs/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function() {
    gulp.watch('./ECT_manual.md', function(event) {
        gulp.run('build');
    });
});

gulp.task('default', ['build']);

