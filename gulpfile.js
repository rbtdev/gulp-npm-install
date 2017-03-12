var gulp = require('gulp');
var exec = require('child_process').exec;
var fs = require('fs');

var path = require('path');

function npmInstall(module) {
    var cmd = exec('cd client &&  npm install @common/' + module + ' -f && cd ../server && npm install @common/' + module + ' -f')
    cmd.stdout.on('data', function (data) {
        process.stdout.write(data);
    });
    cmd.stderr.on('data', function (data) {
        process.stderr.write(data);
    });
}

gulp.task('modules', function () {
    return gulp.src(['common/*'], function (err, files) {
        files.forEach(function (file) {
            if (fs.lstatSync(file).isDirectory()) {
                npmInstall(path.basename(file));
            }
        })
    })
});

gulp.task('watch', ['modules'], function () {
    return gulp.watch(['common/**/*.js', '!common/**/node_modules/**'], function (event) {
        npmInstall(path.basename(path.dirname(event.path)));
    });
})