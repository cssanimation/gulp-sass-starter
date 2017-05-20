var
	gulp = require( 'gulp' ),
	browserSync = require( 'browser-sync' ),
	$ = require( 'gulp-load-plugins' )( {lazy: true} );

gulp.task( 'styles', function () {
	return gulp
		.src( './src/sass/**/*.scss' )
		.pipe( $.sass().on( 'error', $.sass.logError ) )
		.pipe( $.autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
		.pipe( $.cleanCss() )
		.pipe( gulp.dest( 'public/css' ) )
		.pipe( browserSync.reload( {stream: true} ) );
} );

gulp.task( 'scripts', function () {
	return gulp
		.src( ['./src/js/**/*.js'] )
		.pipe( $.plumber() )
		.pipe( $.babel( {
			presets: ['es2015']
		} ) )
		.pipe( $.concat( 'app.js' ) )
		.pipe( $.uglify() )
		.pipe( gulp.dest( 'public/js' ) )
		.pipe( browserSync.reload( {stream: true} ) );
} );

// Optimizes the images that exists
gulp.task( 'images', function () {
	return gulp
		.src( 'src/images/**' )
		.pipe( $.changed( 'images' ) )
		.pipe( $.imagemin( {
			// Lossless conversion to progressive JPGs
			progressive: true,
			// Interlace GIFs for progressive rendering
			interlaced: true
		} ) )
		.pipe( gulp.dest( 'public/images' ) )
		.pipe( $.size( {title: 'images'} ) );
} );

gulp.task( 'html', function () {
	return gulp
		.src( './src/**/*.html' )
		.pipe( gulp.dest( 'public/' ) )
} );

gulp.task( 'browser-sync', ['styles', 'scripts'], function () {
	browserSync( {
		server: {
			baseDir: "./public/",
			injectChanges: true // this is new
		}
	} );
} );

gulp.task( 'deploy', function () {
	return gulp
		.src( './public/**/*' )
		.pipe( ghPages() );
} );

gulp.task( 'watch', function () {
	// Watch .html files
	gulp.watch( 'src/**/*.html', ['html', browserSync.reload] );
	gulp.watch( "public/*.html" ).on( 'change', browserSync.reload );
	// Watch .sass files
	gulp.watch( 'src/sass/**/*.scss', ['styles', browserSync.reload] );
	// Watch .js files
	gulp.watch( 'src/js/*.js', ['scripts', browserSync.reload] );
	// Watch image files
	gulp.watch( 'src/images/**/*', ['images', browserSync.reload] );
} );

gulp.task( 'default', function () {
	gulp.start(
		'styles',
		'scripts',
		'images',
		'html',
		'browser-sync',
		'watch'
	);
} );
