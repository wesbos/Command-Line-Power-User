/*
  first we load in gulp
*/
var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

/*
  then we load all plugins into the p variable with gulp-load-plugins
  we do this so that we don't have to load each one individually
  you will see many examples online that call concat(), sass() or uglify()
  These are now just p.concat(), p.sass() or p.uglify()
*/
var p = require('gulp-load-plugins')();

// globs are basically pattern matches for files. We store them in an object
// because we use them both for gulp.src() as well as gulp.watch()
// if a change to the glob is needed, we simply edit it here rather than in 2 places
var globs = {
  "scripts" : ['source/js/*.js'],
  "styles"  : ['source/css/style.stylus'],
  "templates"  : ['source/index.jade'],
  "images"  : ['source/images/**/*.+(jpg|png)'],
}

gulp.task('scripts',function() {
  gulp.src(globs.scripts)
    .pipe(p.concat('all.js'))
    .pipe(gulp.dest('_build/js'))
    .pipe(p.uglify())
    .pipe(p.rename('all.min.js'))
    .pipe(gulp.dest('_build/js'))
});

gulp.task('styles',function() {
  gulp.src(globs.styles)
    .pipe(p.stylus())
    .pipe(gulp.dest('./_build/css/'))
    .pipe(reload({stream:true}))
});

gulp.task('templates',function() {
  gulp.src(globs.templates)
    .pipe(p.jade())
    .pipe(p.debug())
    .pipe(gulp.dest('./_build/'))
});

gulp.task('images',function() {
  gulp.src(globs.images)
      .pipe(p.debug())
      .pipe(p.imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest('_build/images'))
});

// Start the server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./_build"
        }
    });
});

gulp.task('clean',function() {
  // we return it so it runs async
  return gulp.src('_build/',{read:false})
    .pipe(p.clean({ force : true }))
});

gulp.task('watch', ['browser-sync'] ,function() {
  gulp.watch(globs.scripts,['scripts']);
  gulp.watch(globs.styles,['styles']);
  gulp.watch(globs.templates,['templates']);
});

// the default tasks runs when you simply type 'gulp'
gulp.task('default',['clean','styles','scripts','templates','watch']);
