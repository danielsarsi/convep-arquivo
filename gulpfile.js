const { series, src, dest, watch } = require("gulp");
const fs = require("fs");
const path = require("path");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const posthtml = require("gulp-posthtml");
const htmlnano = require("htmlnano");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const postcssUncss = require("postcss-uncss");
const cssDeclarationSorter = require("css-declaration-sorter");

function clean(done) {
  fs.rmdir(path.resolve(__dirname, "dist/"), { recursive: true }, done);
}

function html() {
  const plugins = [htmlnano({ minifySvg: false })];

  return src("src/*.html").pipe(posthtml(plugins)).pipe(dest("dist/"));
}

function img() {
  return src("src/assets/img/**/*.*")
    .pipe(imagemin())
    .pipe(dest("dist/assets/img"));
}

function fontes() {
  return src("src/assets/fontes/*.{woff,woff2}").pipe(
    dest("dist/assets/fontes")
  );
}

function favicon() {
  return src("src/*.{svg,ico}").pipe(dest("dist/"));
}

function scss() {
  const plugins = [
    cssnano(),
    postcssUncss({
      html: ["dist/*.html"],
    }),
    cssDeclarationSorter(),
  ];

  return src("src/assets/scss/*.scss")
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest("dist/assets/css/"));
}

exports.default = series(clean, html, scss, img, fontes, favicon);

exports.watch = function () {
  exports.default();

  watch("src/assets/*.html", html);
  watch("src/assets/img/**/*.*", img);
  watch("src/assets/fontes/*.*", fontes);
  watch("src/assets/css/*.css", css);
  watch("src/assets/scss/*.scss", scss);
};
