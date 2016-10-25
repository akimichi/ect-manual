var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var run = require('gulp-run');
var foreach = require('gulp-foreach');
var pandoc = require('gulp-pandoc');
var pandocpdf = require('gulp-pandoc-pdf');
var markdownpdf = require('gulp-markdown-pdf');
var markdown = require('gulp-markdown');
var docco = require("gulp-docco");
var ghPages = require('gulp-gh-pages');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var exec = require('child_process').exec;

gulp.task('pdf', function() {
    gulp.src('./*.md')
                 .pipe(markdownpdf())
                 .pipe(gulp.dest('pdf'));
});

/**
 * Build the Jekyll Site
 */
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return exec("jekyll build", function(err, stdout, stderr) {
    console.log(stdout);
  });
    // return cp.spawn( "jekyll" , ['build'], {stdio: 'inherit'})
    //     .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('rebuild', ['build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['rebuild']);
});


// gulp.task("deploy", ["build"], function () {
gulp.task("deploy", function () {
    return gulp.src("./_site/**/*")
        .pipe(ghPages());
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

