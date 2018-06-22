var gulp=require('gulp');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
 
var jsarr=['dist/js/jquery-1.9.1.min.js',
			"dist/js/mobiscroll.custom-2.6.2.min.js",
			"dist/js/tool.js",
			"dist/js/index.js",
			];
var cssarr=['dist/css/index.css',
			'dist/css/mobiscroll.custom-2.6.2.min.css',
			]

gulp.task('test',()=>{
	gulp.src(jsarr).pipe(concat('build/main.js')).pipe(uglify()).pipe(gulp.dest('dist'));
	gulp.src(cssarr).pipe(concat('build/main.css')).pipe(cleanCSS({compatibility:'ie9'})).pipe(gulp.dest('dist'));
	gulp.src(["index.html"]).pipe(concat('index.html')).pipe(gulp.dest('bin'));
})
