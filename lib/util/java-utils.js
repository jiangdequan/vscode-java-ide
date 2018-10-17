// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

const mavenProject = '/src/main/java/';

const javaProject = '/src/';

function removeUselessChar(path) {
    var resultPath = path;
    if (resultPath.endsWith('/')) {
        resultPath = resultPath.substring(0, resultPath.lastIndexOf('/'));
    }
    if (resultPath.startsWith('/')) {
        resultPath = resultPath.substring(1);
    }
    return resultPath;
}

function getDirectory(path) {
    var directory = path;
    // remove the / at the end of the path
    if (directory.endsWith('/')) {
        directory = directory.substring(0, directory.lastIndexOf('/'));
    }

    // remove the / in front of the path
    if (directory.startsWith('/')) {
        directory = directory.substring(1);
    }

    // if the path is file, then remove the filename
    var stat = fs.lstatSync(directory);
    if (stat.isFile()) {
        directory = directory.substring(0, directory.lastIndexOf('/'));
    }
    return directory;
}

function getJavaFilePath(path) {
    var javaFilePath = path;
    if (javaFilePath.startsWith('/')) {
        javaFilePath = javaFilePath.substring(1);
    }
    if (javaFilePath.endsWith('.java')) {
        javaFilePath = javaFilePath.substring(0, javaFilePath.length - 5);
    }
    return javaFilePath;
}

function generateQualifiedName(path) {
    var fsPath = path;
    // get project name from workspace
    var projectName = '';
    var workspaceFolders = vscode.workspace.workspaceFolders;
    for (var workspaceFolder in workspaceFolders) {
        if (fsPath.indexOf(workspaceFolders[workspaceFolder].name) > 0) {
            projectName = workspaceFolders[workspaceFolder].name;
            break;
        }
    }

    // project name and maven folders
    var packagePrefix = projectName + mavenProject;
    var start = fsPath.lastIndexOf(packagePrefix);

    // maven project
    if (start > 0) {
        return fsPath.substring(start + packagePrefix.length, fsPath.length - 1).replace(/\//g, '.');
    }

    // java project
    packagePrefix = projectName + javaProject;
    start = fsPath.lastIndexOf(packagePrefix);
    if (start > 0) {
        return fsPath.substring(start + packagePrefix.length, fsPath.length - 1).replace(/\//g, '.');
    }

    return 'io.github.jiangdequan';
}

function generatePackageName(path) {
    var fsPath = path;
    // get project name from workspace
    var projectName = '';
    var workspaceFolders = vscode.workspace.workspaceFolders;
    for (var workspaceFolder in workspaceFolders) {
        if (fsPath.indexOf(workspaceFolders[workspaceFolder].name) > 0) {
            projectName = workspaceFolders[workspaceFolder].name;
            break;
        }
    }

    // project name and maven folders
    var packagePrefix = projectName + mavenProject;
    var start = fsPath.lastIndexOf(packagePrefix);

    // maven project
    if (start > 0) {
        return fsPath.substring(start + packagePrefix.length, fsPath.length).replace(/\//g, '.');
    }

    // java project
    packagePrefix = projectName + javaProject;
    start = fsPath.lastIndexOf(packagePrefix);
    if (start > 0) {
        return fsPath.substring(start + packagePrefix.length).replace(/\//g, '.');
    }

    return 'io.github.jiangdequan';
}

function format(template) {
    if (arguments.length == 1) {
        return template;
    }
    var s = template;
    for (var i = 0, len = arguments.length; i < len; i++) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i + 1]);
    }
    return s;
}

function upperCaseFirstChar(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function checkPackageName(packageName) {
    var packageNameReg = /[a-z]+[0-9a-z]*(\.[a-z]+[0-9a-z]*)*/;
    var result = packageName.match(packageNameReg);
    if (null === result || 0 === result.length) {
        return false;
    }
    if (packageName !== result[0]) {
        return false;
    }
    return true;
}

function checkNewFilename(newJavaFilename, path, suffix) {
    var exist = false;
    var files = fs.readdirSync(path);
    files.forEach(function(file) {
        if ((newJavaFilename + suffix).toLowerCase() === file.toLowerCase()) {
            exist = true;
        }
    });
    return exist;
}

function readFileToJson(path) {
    try {
        if (!fs.existsSync(path)) {
            return '';
        }
        var content = fs.readFileSync(path, 'utf-8');
        if (undefined === content || '' === content) {
            return '';
        }
        // 解析配置文件为JSON
        return JSON.parse(content);
    } catch(error) {
        console.log(error);
    }
    return '';
}

function isClassParameter(line) {
    if (line.includes('static') || line.includes('final')) {
        return false;
    }
    if (line.startsWith('private') && line.endsWith(';')) {
        return true;
    }
    return false;
}

function getTypeName(words) {
    for (var i = 0, size = words.length; i < size; i++) {
        if ('=' === words[i] || ';' === words[i]) {
            return concatTypeName(words, i - 1);
        } else if (words[i].endsWith(';')) {
            return concatTypeName(words, i);
        }
    }
}

function concatTypeName(words, index) {
    var typeName = '';
    for (var i = 1; i < index; i++) {
        typeName += words[i];
        if (words[i].endsWith(',')) {
            typeName += ' ';
        }
    }
    return typeName;
}

function getParameterName(words) {
    for (var i = 0, size = words.length; i < size; i++) {
        if ('=' === words[i] || ';' === words[i]) {
            return words[i - 1];
        } else if (words[i].endsWith(';')) {
            return words[i];
        }
    }
}

exports.upperCaseFirstChar = upperCaseFirstChar;
exports.generatePackageName = generatePackageName;
exports.generateQualifiedName = generateQualifiedName;
exports.format = format;
exports.getDirectory = getDirectory;
exports.getJavaFilePath = getJavaFilePath;
exports.checkNewFilename = checkNewFilename;
exports.checkPackageName = checkPackageName;
exports.readFileToJson = readFileToJson;
exports.removeUselessChar = removeUselessChar;
exports.isClassParameter = isClassParameter;
exports.getTypeName = getTypeName;
exports.getParameterName = getParameterName;