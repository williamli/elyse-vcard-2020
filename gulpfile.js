const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano');
const htmlmin = require('gulp-htmlmin');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const del = require('del');

const browserSync = require('browser-sync').create();

gulp.task('sass', function () {   
   return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(postcss([ autoprefixer(), cssnano() ]))
  .pipe(sourcemaps.write('.'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest('src/css')) 
})

gulp.task('asset-opt', function(){
  return gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpif('*.js', uglify()))
  .pipe(gulp.dest('public'))
});

gulp.task('html-minify', function(){
  return gulp.src(['public/**/*.html'])
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest('public'));
});

gulp.task('css-copy', function(){
   return gulp.src('src/css/**/*')
   .pipe(gulp.dest('public/css'))
});

gulp.task('img-optimise', function(){
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/img'))
});

gulp.task('clean-build', function () {
  return del([
  'public/*'
  ]);
});

gulp.task('serve', function(){
  browserSync.init({
    server: 'src',
    port: 3000,
    watch: true
  });
})

gulp.task('reload', function(done){
  browserSync.reload();
  done();
})

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  // gulp.watch('src/js/**/*.js', gulp.series('reload'));
  // gulp.watch('src/**/*.html', gulp.series('reload'));
})


gulp.task('default', gulp.parallel('serve', 'watch'));
gulp.task('build', gulp.series('clean-build', 'asset-opt', 'css-copy', 'html-minify', 'img-optimise'));