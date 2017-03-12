var gulp = require('gulp');
var exec = require('child_process').exec;
var fs = require('fs');

var path = require('path');

function npmInstall(module) {
    return new Promise(function (resolve, reject) {
        var cmd = exec('cd client &&  npm install @common/' + module + ' -f && cd ../server && npm install @common/' + module + ' -f', function (err) {
            if (err) return reject(err);
            return resolve();
        })
        cmd.stdout.on('data', function (data) {
            process.stdout.write(data);
        });
        cmd.stderr.on('data', function (data) {
            process.stderr.write(data);
        });
    })

}

gulp.task('modules', function () {
    return gulp.src(['common/*'], function (err, files) {
        files.forEach(function (file) {
            if (fs.lstatSync(file).isDirectory()) {
                return npmInstall(path.basename(file));
            }
        })
    })
});

gulp.task('watch', ['modules'], function () {
    return gulp.watch(['common/**/*.js', '!common/**/node_modules/**'], function (event) {
        return npmInstall(path.basename(path.dirname(event.path)));
    });
})