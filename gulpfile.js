var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var gulp = require('gulp');
var gutil = require('gulp-util');
var colors = require('colors');
var plugins = require('gulp-load-plugins')();
var mergeStream = require('merge-stream');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var superagent = require('superagent');

var paths = {
	scripts: [
		'public/js/**/*.js',
		'app/**/*.js'
	],
	data: [
		'models/data/**/*.js'
	],
	build: 'build',
	phoneGap: {
		buildDir: 'build/phonegap',
		zip: 'build/phonegap.zip',
		zipRelative: '../phonegap.zip', // Relative path of the zip from buildDir
	}
};

// Useful functions {{{
/**
* Wrapper function to quickly include an external run inside Gulp
*
* @param string command The command to run
* @param object options Options object
* @param function next Callback(code) to call on finish
*
* @param string options.cwd Set the working directory of the sub-process
* @param object options.env Environment key pairs
* @param string options.encoding Default encoding for streams (default: 'utf8')
* @param int options.timeout (default: 0)
* @param int options.maxBuffer (default: 200*1024)
* @param string options.killSignal (Default: 'SIGTERM')
* @param bool options.ignoreFail (custom functionality) Ignore fail codes and always treat the sub-process as executing correctly
* @param string options.method (custom functionality, default: 'exec') Which execution method to follow (some of the above settings can force this)
* @param null|function(data) options.stdout (custom functionality, default: null) Call this function on each stdout data burst
* @param null|function(data) options.stderr (custom functionality, default: null) Call this function on each stderr data burst
* @param bool options.passthru (custom functionality, default: false) Send all output from this command to the console as if it were run stand-alone - this really is just a macro for turning on certain flags
*/
function run(command, options, next) {
	var child_process = require('child_process');
	gutil.log('Run: ' + command);
	if (!options.encoding)
		options.encoding = 'utf8';
	if (options.passthru) {
		options.method = 'spawn';
		options.stdio = 'inherit';
	}

	if (!options.method || options.method == 'exec') {
		child_process.exec(command, options, function(err, stdout, stderr) {
			if (stdout)
				gutil.log('Child process responded:', stdout);
			if (stderr)
				gutil.log('Child process err:', stderr);
			if (options.ignoreFail)
				return next();
			if (err && err.code)
				return next(err.code);
			return next();
		});
	} else if (options.method == 'spawn') {
		if (typeof command != 'array')
			command = command.split(' ');

		var process = child_process.spawn(command[0], command.slice(1), options);
		process.on('close', function(code) {
			next(code);
		});
		if (options.stdout) {
			process.stdout.setEncoding(options.encoding);
			process.stdout.on('data', options.stdout);
		}
		if (options.stderr) {
			process.stderr.setEncoding(options.encoding);
			process.stderr.on('data', options.stderr);
		}
	}
}
// }}}

/**
* Generic build-all script
*/
gulp.task('build', ['scripts']);

/**
* Compile all JS files into the build directory
*/
gulp.task('scripts', [], function() {
	return gulp.src(paths.scripts)
		// .pipe(plugins.uglify())
		.pipe(plugins.concatSourcemap('all.min.js'))
		.pipe(gulp.dest(paths.build));
});

/**
* Spew a template file into the main JS file
* This is only really needed on mobile devices to speed up the template load time
* Its needed for PhoneGap which for some reason can't load external files for use in an ngView
*/
gulp.task('scripts:templateCache', ['scripts'], function(next) {
	var mainBuild = gulp.src('build/all.min.js');

	var templateCache = gulp.src('views/templates/**/*.html')
		.pipe(plugins.angularTemplatecache('templateCache.js', {
			root: '/templates',
			module: 'app'
		}))
		.pipe(plugins.replace(/(href|src)=(\\["'])\//g, '$1=$2')); // Rewrite all literal paths to relative ones

	var merged = mergeStream(mainBuild, templateCache)
		.pipe(plugins.concat('all.min.js'))
		.pipe(gulp.dest('build'));
	return merged;
});

/**
* Lint all JS files
*/
gulp.task('lint', function () {
	gulp.src(paths.scripts)
		.pipe(plugins.jshint());
})

/**
* Setup the local Mongo DB with all the files located in paths.data
*/
gulp.task('db', function() {
	gulp.src(paths.data, {read: false})
		.pipe(plugins.shell('node <%=file.path%>'));
});

/**
* Output the current environment config
*/
gulp.task('config', function() {
	var config = require('./config/global');
	gutil.log(config);
});

/**
* Launch a server and watch the local file system for changes (restarting the server if any are detected)
*/
gulp.task('default', ['scripts'], function () {
	plugins.nodemon({
		script: 'server.js',
		ext: 'html js ejs',
		ignore: ['build/*'],
	})
		.on('change', ['scripts'])
		.on('restart', function (a,b,c) {
			gutil.log('Restarted!'.red)
		});
});


gulp.task('bump', function() {
	var stream = gulp.src('./package.json')
		.pipe(plugins.bump({type: 'patch'})) // Types: major|minor|patch|prerelease
		.pipe(gulp.dest('./'));
	return stream;
});

// Debug kit {{{
gulp.task('dbtest', function(next) {
	global.config = require('./config/global');
	gutil.log('Opening DB connection...');
	require('./config/db');
	gutil.log('Testing User query...');
	var users = require('./models/users');
	users.find({}, function(err, data) {
		if (err) {
			gutil('Got error', err.red);
		} else {
			gutil.log('Got data', data);
		}
		next(err);
	});
});
// }}}

// OpenShift functionality {{{
/**
* Push a local database to a remote OpenShift MongoDB instance
* Requires config/openshift.js to be present and populated to get all OpenShift info
* Requires `rhc` to be installed
*/
gulp.task('osdbpush', function() {
	process.env.NODE_ENV = 'openshift';
	var config = require('./config/global');

	var spawn = require('child_process').spawn;
	var exec = require('child_process').exec;
	var tunnel;

	async.series([
		function(next) {
			gutil.log('Setting up connection to OpenShift...');
			tunnel = spawn('rhc', ['port-forward', '--config', config.openshift.configFile, '-a', config.openshift.project]);
			tunnel.stdout.setEncoding('utf8');
			tunnel.stdout.on('data', function(data) {
				gutil.log('Child process responded:', data);
				if (/^done/.exec(data)) // Tunnel setup correctly
					return next(null);
			});
			tunnel.stderr.setEncoding('utf8');
			tunnel.stderr.on('data', function(data) {
				gutil.log('Child process err:', data);
			});
			tunnel.on('close', function(code) {
				if (code != 0)
					return next('Port forwarder exited with code', code);
			});
		},
		function(next) {
			gutil.log('Connected to OpenShift with port forwarding');
			gutil.log('Dumping local database...');
			exec('mongodump -d ' + config.mongo.name + ' -o ' + config.openshift.mongo.tempFolder, function(err, stdout, stderr) {
				if (stdout)
					gutil.log('Child process responded:', stdout);
				if (stderr)
					gutil.log('Child process err:', stderr);
				return next(err);
			});
		},
		function(next) {
			gutil.log('Uploading database to OpenShift...');
			exec('mongorestore -d ' + config.mongo.name + ' -h localhost --port ' + config.openshift.mongo.remotePort + ' --username ' + config.openshift.mongo.username + ' --password ' + config.openshift.mongo.password + ' ' + config.openshift.mongo.tempFolder + '/' + config.mongo.name, function(err, stdout, stderr) {
				if (stdout)
					gutil.log('Child process responded:', stdout);
				if (stderr)
					gutil.log('Child process err:', stderr);
				return next(err);
			});
		},
		function(next) {
			gutil.log('Closing tunnel...');
			tunnel.kill();
			return next();
		},
		function(next) {
			gutil.log('Cleaning up...');
			exec('rm -r "' + config.openshift.mongo.tempFolder + '"', function(err, stdout, stderr) {
				if (stdout)
					gutil.log('Child process responded:', stdout);
				if (stderr)
					gutil.log('Child process err:', stderr);
				return next(err);
			});
		}
	]);
});

/**
* Connect to a remote OpenShift instance and tail its console output
* Requires config/openshift.js to be present and populated to get all OpenShift info
* Requires `rhc` to be installed
*/
gulp.task('ostail', function() {
	process.env.NODE_ENV = 'openshift';
	var config = require('./config/global');

	var spawn = require('child_process').spawn;
	var tailer = spawn('rhc', ['tail', '--config', config.openshift.configFile, '-a', config.openshift.project]);
	tailer.stdout.setEncoding('utf8');
	tailer.stdout.on('data', function(data) {
		gutil.log(data);
	});
	tailer.stderr.setEncoding('utf8');
	tailer.stderr.on('data', function(data) {
		gutil.log(data.red);
	});
});

/**
* Restart this OpenShift instance
* Requires config/openshift.js to be present and populated to get all OpenShift info
* Requires `rhc` to be installed
*/
gulp.task('osrestart', function() {
	process.env.NODE_ENV = 'openshift';
	var config = require('./config/global');

	var spawn = require('child_process').spawn;
	var tailer = spawn('rhc', ['app', 'restart', '--config', config.openshift.configFile, '-a', config.openshift.project]);
	tailer.stdout.setEncoding('utf8');
	tailer.stdout.on('data', function(data) {
		gutil.log(data);
	});
	tailer.stderr.setEncoding('utf8');
	tailer.stderr.on('data', function(data) {
		gutil.log(data.red);
	});
});
// }}}

// Phonegap Functionality {{{
/**
* User friendly function to compile + upload + wait for finish of a PhoneGap application
*/
gulp.task('pg', [], function(next) {
	runSequence(
		'bump',
		'pgpush',
		'pgclean',
		'pgwait',
		next
	);
});

/**
* Cleans the PhoneGap build
*/
gulp.task('pgclean', [], function(next) {
	gutil.log('Cleaning PhoneGap build...');
	rimraf(paths.phoneGap.buildDir, next);
});

/**
* Compiles the PhoneGap ZIP object to be uploaded
*/
gulp.task('pgbuild', ['scripts:templateCache', 'pgclean'], function(mainNext) {
	var config = require('./config/global');

	var exec = require('child_process').exec;
	var spawn = require('child_process').spawn;

	async.series([
		function(next) {
			gutil.log('Making directory structure for PhoneGap...');
			mkdirp(paths.phoneGap.buildDir + '/build', next);
		},
		function(next) {
			// Bulid + template the config.xml file from the projects config
			gutil.log('Building config.xml v', config.package.version.cyan, '...');
			fs.readFile('config.xml', function(err, data) {
				var outConfigXML = _.template(data, config);
				fs.writeFile(paths.phoneGap.buildDir + '/config.xml', outConfigXML, next);
			});
		},
		function(next) {
			gutil.log('Downloading main site page...');

			run('wget -q -r -l inf --no-host-directories "' + config.url + '"', {cwd: paths.phoneGap.buildDir, ignoreFail: true}, next);
		},
		function(next) {
			gutil.log('Rewriting all links in HTML files...');
			gulp.src(paths.phoneGap.buildDir + '/index.html')
				.pipe(plugins.replace(/(href|src)=(["'])\//g, '$1=$2')) // Rewrite all root paths to relative ones
				.pipe(gulp.dest(paths.phoneGap.buildDir))
				.on('end', next);
		},
		function(next) {
			gutil.log('Copying other assets...');

			gutil.log(' * Images');
			gulp.src('public/img/**')
				.pipe(gulp.dest('build/phonegap/img'))
				.on('end', next);
		},
		function(mainNext) {
			gutil.log('Applying fixes...');

			async.parallel([ // {{{
				/**
				* Fixes the *&^%$ annoying bug where Fontawesome sticks '?v=4.1.0' at the end of file names in both CSS and the files on disk
				* This REALLY upsets PhoneGap so we need to change the original CSS + the file names on disk
				*/
				function(next) {
					gutil.log(' * Mobile-Angular-UI / FontAwesome using ?v=x bug');
					gulp.src(paths.phoneGap.buildDir + '/bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css')
						.pipe(plugins.replace(/(fontawesome-webfont\.(eot|woff|ttf|svg)).*?\)/g, '$1)'))
						.pipe(gulp.dest(paths.phoneGap.buildDir + '/bower_components/mobile-angular-ui/dist/css'))
						.on('end', function() {
							// Delete auto completed directory
							rimraf(paths.phoneGap.buildDir + '/bower_components/mobile-angular-ui/dist/fonts', function() {
								gulp.src('bower_components/mobile-angular-ui/dist/fonts/*') // Copy from known good directory
									.pipe(gulp.dest(paths.phoneGap.buildDir + '/bower_components/mobile-angular-ui/dist/fonts'))
									.on('end', next);
							});
						});
				}
			], mainNext); // }}}
		},
		function(next) {
			fs.exists(paths.phoneGap.zip, function(exists) {
				if (exists) {
					gutil.log('Deleting existing ZIP...');
					fs.unlink(paths.phoneGap.zip, next);
				} else
					next();
			});
		},
		function(next) {
			gutil.log('Compressing into ZIP...');
			run("zip -qr '" + paths.phoneGap.zipRelative + "' *", {cwd: paths.phoneGap.buildDir}, next);
		},
		function(next) {
			fs.stat(paths.phoneGap.zip, function(err, stat) {
				gutil.log('Done, ZIP size:', stat.size.toString().cyan, 'bytes');
				next();
			});
		}
	], mainNext);
});

/**
* Compiles + uploads the latest ZIP image to the PhoneGap Build service
*/
gulp.task('pgpush', ['pgbuild'], function(next) {
	var config = require('./config/global');
	gutil.log('Uploading ZIP image...');

	superagent
		.put('https://build.phonegap.com/api/v1/apps/' + config.phonegap.appId)
		.auth(config.phonegap.username, config.phonegap.password)
		.attach('file', paths.phoneGap.zip)
		.end(function(err, res) {
			if (res.status == '200') {
				gutil.log('Zip image uploaded');
				next();
			} else {
				gutil.log('Problem uploading ZIP image');
				next(err);
			}
		});
});

/**
* Retrieves the current PhoneGap Build status object from the server
*/
gulp.task('pgstatus', [], function(next) {
	var config = require('./config/global');
	var util = require('util');
	superagent
		.get('https://build.phonegap.com/api/v1/apps/' + config.phonegap.appId)
		.auth(config.phonegap.username, config.phonegap.password)
		.end(function(err, res) {
			gutil.log(util.inspect(res.body, {depth: 3}));
			next(err);
		});
});

/**
* Similar to `pgstatus` this task obtains the current status object and keeps checking until the android app status is compiled
*/
gulp.task('pgwait', [], function(next) {
	var config = require('./config/global');
	var util = require('util');
	var tryCount = 1;

	var scan = function() {
		superagent
			.get('https://build.phonegap.com/api/v1/apps/' + config.phonegap.appId)
			.auth(config.phonegap.username, config.phonegap.password)
			.end(function(err, res) {
				if (res.body.status.android == 'complete') {
					gutil.log('Android app', res.body.version.cyan, 'compiled!'.green);
					next();
				} else {
					if (tryCount == 1) {
						gutil.log('Android app', res.body.version.cyan, 'compiling...');
					} else {
						gutil.log(' * Refresh #' + tryCount.toString().cyan + '. Still compiling...');
					}
					tryCount++;
					setTimeout(scan, 2000);
				}
			});
	};
	scan();
});
// }}}
