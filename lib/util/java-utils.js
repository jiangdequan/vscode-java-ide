// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

const mavenProject = '/src/main/java/';

const javaProject = '/src/';

function getDirectory(path) {
    var directory = path;
    if (path.endsWith('/')) {
        directory = path.substring(0, path.lastIndexOf('/'));
    }
    if (path.startsWith('/')) {
        directory = directory.substring(1);
    }
    if (path.endsWith('.java')) {
        directory = directory.substring(0, directory.lastIndexOf('/'));
    }
    return directory;
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

function getJavaFilePath(path) {
    var javaFilePath = path;
    if (path.startsWith('/')) {
        javaFilePath = path.substring(1);
    }
    if (javaFilePath.endsWith('.java')) {
        javaFilePath = javaFilePath.substring(0, javaFilePath.length - 5);
    }
    return javaFilePath;
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

function checkNewFilename(newJavaFilename, path) {
    var exist = false;
    var files = fs.readdirSync(path);
    files.forEach(function(file) {
        if ((newJavaFilename + '.java').toLowerCase() === file.toLowerCase()) {
            exist = true;
        }
    });
    return exist;
}

exports.upperCaseFirstChar = upperCaseFirstChar;
exports.generatePackageName = generatePackageName;
exports.generateQualifiedName = generateQualifiedName;
exports.format = format;
exports.getDirectory = getDirectory;
exports.getJavaFilePath = getJavaFilePath;
exports.checkNewFilename = checkNewFilename;
exports.checkPackageName = checkPackageName;