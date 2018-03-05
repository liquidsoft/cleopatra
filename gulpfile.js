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
			presets: [["env", {targets: {node: "4"}}]]
		}))
		.pipe(gulp.dest("./build"));
});