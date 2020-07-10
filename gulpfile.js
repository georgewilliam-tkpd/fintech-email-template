"use strict";

const gulp = require("gulp");
const htmlMin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const cleanCss = require("gulp-clean-css");
const inlineCss = require("gulp-inline-css");
const extReplace = require('gulp-ext-replace');

const browserSync = require("browser-sync").create();
const panini = require("panini");
const inky = require("inky");

const paniniOptions = {
  root: "src/pages/",
  layouts: "src/layouts/",
  partials: "src/partials/",
  data: "src/data/",
  helpers: "src/helpers/"
};

const browserSyncOptions = {
  open: false,
  port: 3030,
  server: {
    baseDir: "./dist/"
  }
};

const htmlMinOptions = {
  removeComments: true
};

const inlineCssOptions = {
removeHtmlSelectors: true
};

const htmlPath = 'src/{layouts,partials,helpers,data,pages}/**/*';
const pagesPath = "src/pages/**/*.{hbs,html}";

const paniniTask =   () => gulp
  .src(pagesPath)
  .pipe(panini(paniniOptions))
  .pipe(inky())
  .pipe(extReplace('.html')) 
  .pipe(gulp.dest("dist/"))
;

/* Compile SASS into minified CSS */
gulp.task("sass",  () => gulp
    .src("src/scss/*.scss")
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(gulp.dest("dist/css"))
);

/* Integrate All Layout from Panini */
gulp.task("panini", paniniTask);

/* Clean and minify HTML, also embed inline CSS on tags */
gulp.task("htmlMin",  () => gulp
    .src("dist/**/*.html")
    .pipe(htmlMin(htmlMinOptions))
    .pipe(inlineCss(inlineCssOptions))
    .pipe(gulp.dest("dist/"))
);

/* Static Server */
gulp.task("browserSync", () => browserSync.init(browserSyncOptions) );

/* Watch all Changes */
gulp.task("watch", () => {
  gulp.watch(htmlPath).on("change", () => {
    panini.refresh();
    paniniTask();
    browserSync.reload();
  });

  //gulp.watch(htmlPath).on("change", browserSync.reload);

  gulp.watch("src/scss/*.scss", gulp.parallel("sass"));
  gulp.watch("src/scss/*.scss").on("change", browserSync.reload);
});

/* Build emails, run the server, and watch for file changes */
gulp.task("default", gulp.parallel("sass", "panini", "watch", "browserSync"));

/* Build the "dist" folder by running all of the below tasks */
gulp.task("build", gulp.parallel("htmlMin"));