var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var Q = require('q');

var IS_DEVELOPMENT = 'environment' in process.env && process.env.environment == 'development';
var IS_PRODUCTION = false;

/**
 * kompilerer src/less/** til public/css/
 * @import blir håndtert av less-kompilatoren
 */
gulp.task('styles', function () {

    var lessFilter = $.filter('**/*.less');

    var bowerDeps = require('wiredep')({
        directory: 'src/bower_components'
    });

    var sources = _.flatten(['src/less/main.less', bowerDeps.css]);

    gulp.src(sources)
        // kjør less-kompilator på less-filer
        .pipe(lessFilter)
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.sourcemaps.write())
        // slå av less-filter
        .pipe(lessFilter.restore())
        // optimize css
        .pipe($.if(IS_PRODUCTION, $.csso()))
        .pipe($.concat('main.css'))
        .pipe(gulp.dest('public/styles'));
});

gulp.task('scripts', function() {

    var config = require('./require-config.json');

    return gulp.src('src/js/**/*.js')
		.pipe(require("amd-optimize")("main", config))
	//	.pipe($.jshint())
     //	.pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.concat({path:'main.js'}))
//		.pipe($.buster('busters.json'))
		// only uglify in production
		// need angular annotations when in production
		.pipe($.if(IS_PRODUCTION, $.ngAnnotate()))
		.pipe($.if(IS_PRODUCTION, $.uglify()))
        .pipe(gulp.dest('public/scripts'))
        .pipe($.size());
});

/**
 * henter alle bower-dependencies og lagrer dem i require-config.json
 */
gulp.task('wire-bower-require', function () {
    var config, bowerParser = require('bower-requirejs/lib/build-config');
    // lag et promise
    var deferred = Q.defer();

    // hent eksisterende require-config
    var requireConf = require('./require-config.json');

    // `bower list`
    require('bower').commands.list({}, {offline:true})
        .on('end', function (dependencyGraph) {

            // lag en require-config av dependency-grafen med bower-requirejs
            var bowerConf = bowerParser(dependencyGraph, {
                baseUrl: 'src/js',
                transitive: true
            });

            // legg paths fra bower på require-configen
            var config = _.extend(requireConf, bowerConf);

            // lagre til fil require-config.json
            require('fs').writeFileSync('require-config.json', JSON.stringify(config, null, '  '));

            deferred.resolve(config);
    });
    return deferred.promise;
});

/**
 * bygger styles, scripts og oppdaterer html som nødvendig
 */
gulp.task('html', function() {

//    var cacheBust = require('./public/scripts/busters.json');
      var cacheBust = {'main.js': ''};

    return gulp.src('src/**/*.html')

        .pipe($.htmlReplace({js: {
            src: '',
            tpl: '<script src="scripts/main.js?'+cacheBust['main.js']+'"></script>'
        }}))

//        .pipe($.if(IS_PRODUCTION, $.htmlmin({
//            collapseWhitespace: true,
//            removeComments: true,
//            collapseBooleanAttributes: true,
//            removeRedundantAttributes: true
//            })))

		// @TODO gulp-changed
    .pipe(gulp.dest('public'));
});

/**
 * optimiserer bilder
 */
gulp.task('images', function () {
    return gulp.src('src/images/**/*')

        .pipe(gulp.dest('public/images'))
        .pipe($.size());
});

gulp.task('print', function() {

	console.dir(gulp);

});

/**
 * finner alle font-filer fra bower og legger de under public/fonts
 */
gulp.task('fonts', function () {
    var bowerFiles = require('main-bower-files')();

    return gulp.src(bowerFiles, {base: 'src/bower_components'})
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('public/fonts'))
        .pipe($.size());
});

/**
 * starter en lokal webserver på port 9000
 */
gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('public'))
        .use(connect.directory('public'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

/**
 * starter en webserver og åpner adressen
 */
gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

/**
 * starter en lokal webserver,
 * lytter på endringer i kildekoden og kompilerer
 * lytter på endringer av kompilert kode og kjører livereload
 */
gulp.task('watch', ['build', 'serve'], function () {
    var server = $.livereload();
	var path = require('path');

    gulp.watch(['src/**/*.html', 'public/scripts/busters.json'], ['html']);
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/images/**/*', ['images']);

    // endringer i bower-dependencies
    gulp.watch('bower.json', ['wire-bower-require']);

    // endringer i require-config
    gulp.watch('require-config.json', ['scripts', 'styles']);

    // refresh browser ved endringer i public
    gulp.watch([
        'public/**/*'
    ]).on('change', function (file) {
		$.util.log('reloading '+path.relative(__dirname, file.path));
        server.changed(file.path);
    });

});

gulp.task('build', ['wire-bower-require', 'styles', 'scripts', 'html', 'images', 'fonts']);

gulp.task('default', ['build']);

module.exports = gulp;
