const
	gulp = require("gulp"),
	babel = require("gulp-babel");

gulp.task("default", ["build"], () => {
});

/*
 -------------------------------
 Build with babel
 -------------------------------
 */

gulp.task("build", () => {
	return gulp.src("./lib/**/*.js")
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(gulp.dest("./build"));
});