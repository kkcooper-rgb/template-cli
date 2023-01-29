#!/usr/bin/env node

const fs = require('fs')
const iconv = require("iconv-lite")
const argv = process.argv
const execFile = require('child_process').spawn
const outFileName = argv[argv.length - 1]
const file = __dirname + '/src/tencent_module/' + outFileName + '.js'
const targetFile = __dirname + '/src/tencent_module/index.js'
const targetDirectory = __dirname + "/target"
const imTargetFile = __dirname + '/src/im.js'
const imSourceFile = __dirname + `/lib/im_${process.env.GUO_ZHAN_ENV || 'prod'}.js`

function getDateString() {
    let date = new Date()
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return '' + Y + '-' + M + '-' + D + '_' + h + '-' + m + '-' + s
}

function replaceFiles(callback) {
    let files = {
        "/lib/style-vw-loader.js": __dirname + "/node_modules/style-vw-loader/index.js",
        '/lib/VueContext_build.js': __dirname + '/src/VueContext.js'
    }

    let loop = {
        keys: [],
        sourceFiles: [],
        index: -1,
        files: files,
        source: function () {
            return __dirname + this.keys[this.index]
        },
        target() {
            return this.files[this.keys[this.index]]
        },
        next() {
            this.index++
            if (this.index < this.keys.length) {
                return this
            } else {
                return null
            }
        }
    }
    for (let key in files) {
        loop.keys[loop.keys.length] = key
    }
    let next = function (loop) {
        loop = loop.next()
        if (loop == null) {
            callback()
            return
        }
        let target = loop.target()
        let source = loop.source()
        replaceFile(() => {
            next(loop)
        }, source, target)
    }
    next(loop)
}

function replaceFile(callback, source, target) {
    let copy = function () {
        fs.copyFile(source, target, function () {
            callback()
        })
    }
    fs.stat(target, function (e) {
        if (!e) {
            fs.unlink(target, function () {
                copy()
            })
            return
        }
        copy()
    })
}

function copyFile() {
    let files = [__dirname + "/dist/js/index.js", __dirname + "/dist/css/index.css"]
    let dateString = getDateString()
    for (let i = 0; i < files.length; i++) {
        fs.stat(files[i], function (e) {
            if (e) {
                return
            }
            fs.copyFile(files[i], targetDirectory + "/" + outFileName + '_' + dateString + files[i].slice(files[i].lastIndexOf(".")), function () {

            })
        })
    }
}

function execCommand() {
    if (argv.length < 3) {
        console.log("No command")
        return
    }

    let commandArray = argv.slice(2, argv.length - 1)
    let command
    let args = []
    if (commandArray.length > 1) {
        command = commandArray[0]
        args = commandArray.slice(1)
    } else if (commandArray.length > 0) {
        command = commandArray[0]
    } else {
        console.log("No command")
        return
    }
    let process = execFile(command, args, {shell: true})
    process.stdout.on('data', function (thunk) {
        console.log(iconv.decode(thunk, 'utf-8'))
    })
    process.stderr.on("data", function (data) {
        console.log(iconv.decode(data, 'utf-8'));
    });
    process.on('error', function (e) {
        console.log(e)
    })
    process.on('exit', function () {
        fs.stat(targetDirectory, function (e) {
            if (e) {
                fs.mkdir(targetDirectory, function () {
                    copyFile()
                })
            } else {
                copyFile()
            }
        })
    });
}

fs.stat(file, function (e) {
    if (e) {
        console.log('Not found file "' + file + '"')
        return
    }
    replaceFile(function () {
        replaceFile(function () {
            replaceFiles(execCommand)
        }, imSourceFile, imTargetFile)
    }, file, targetFile)
})