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

gulp.task('pdf', function() {
    gulp.src('./*.md')
                 .pipe(markdownpdf())
                 .pipe(gulp.dest('build/pdf'));
});

/**
 * Build the Jekyll Site
 */
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( "jekyll" , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
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
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});


gulp.task('doc', function() {
    return gulp.src('index.md')
        .pipe(markdown())
        .pipe(gulp.dest('docs'));
    // gulp.src('./*.md')
    //     .pipe(pandoc({
    //         from: 'markdown',
    //         to: 'html5',
    //         ext: '.html',
    //         args: ['--smart']
    //     }))
    //     .pipe(gulp.dest('docs/'));
});

            // args: ['-s', '-t revealjs', '-i', '-V theme:default']


gulp.task('doccco', function() {
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
    gulp.watch('./index.md', function(event) {
        gulp.run('build');
    });
});
gulp.task('build', ['pdf','doc']);
gulp.task('default', ['build', 'deploy']);
