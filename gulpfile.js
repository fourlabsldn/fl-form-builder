/* eslint-disable quote-props */
// List all available tasks

const src = "src";
const dest = "dist";
const path = require("path");

const reactConfig = {
  external: ["react", "react-dom"],
  format: "umd",
};


const organiser = require("gulp-organiser");
organiser.registerAll("./gulp-tasks", {
  sass: {
    src: path.join(src, "styles/**/*.scss"),
    dest,
  },
  "transpile-react": {
    "application": {
      watch: path.join(src, "js/**/*.js"),
      src: path.join(src, "js", "index.js"),
      dest,
      rename: "fl-form-builder.js",
      config: Object.assign({}, reactConfig, { moduleName: "FormBuilder" }),
    },
    "demo-image-type": {
      src: "./examples/custom-type/src/ImageCards.js",
      dest: "./examples/custom-type/dist",
      config: Object.assign({}, reactConfig, { moduleName: "ImageCards" }),
    },
    "demo-date-type": {
      src: "./examples/date-type/src/DateField.js",
      dest: "./examples/date-type/dist",
      config: Object.assign({}, reactConfig, { moduleName: "DateField" }),
    },
    tests: {
      watch: path.join(src, "**/*.js"),
      src: path.join(src, "tests", "index.js"),
      dest,
      rename: "fl-form-builder-tests.js",
      config: Object.assign({}, reactConfig, { moduleName: "FormBuilderTests" }),
    },
  },
  "browser-sync": {
    src: ".", // it doesn"t matter, it"s just so the task object is not ignored.
    reloadOn: ["transpile-react", "sass"], // reload page when these tasks happen
    startPath: "examples/custom-type/index.html",
    baseDir: "./",
  },
  "test-headless": {
    src: "__tests__/*.test.js",
  },
  "watch": {
    "dev": {
      src: ".",
      taskNames: ["transpile-react:tests", "transpile-react:application"],
    },
    "transpile-react:application": {
      src: ".",
      taskNames: ["transpile-react:application"],
    },
  },
  "copy-static": {
    src: "node_modules/jasmine-core/**/*",
    dest: "examples/jasmine-core",
    map: {},
  },
});
