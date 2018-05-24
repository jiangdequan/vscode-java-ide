// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const clipboardy = require('clipboardy');

var classTemplate = 'package {0};\n\n'
                  + 'public {1} {2} {\n'
                  + '    \n'
                  + '}';

var getterTemplate = '    /**\n'
                   + '     * @return {0} return the {1}\n'
                   + '     */\n'
                   + '    public {2} get{3}() {\n'
                   + '        return {4};\n'
                   + '    }\n\n';

var setterTemplate = '    /**\n'
                   + '     * @param {0} the {1} to set\n'
                   + '     */\n'
                   + '    public void set{2}({3} {4}) {\n'
                   + '        this.{5} = {6};\n'
                   + '    }\n\n';

const FileType = {
    "class": "class",
    "enum": "enum",
    "annotation": "@interface",
    "interface": "interface"
}

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
    return directory;
}

/**
 * 
 * @param {*} path 
 */
function removeInvalidChar(path) {
    var lastPart = path.substring(path.lastIndexOf('/'));
    if (lastPart.includes('.')) {
        return path.substring(1, path.lastIndexOf('/') + 1);
    }
    if (path.endsWith('/')) {
        return path.substring(1);
    }
    return path.substring(1) + '/';
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
        return fsPath.substring(start + packagePrefix.length, fsPath.length - 1).replace(/\//g, '.');
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

exports.generateGettersAndSetters = function (context, command) {
    var newCommand = vscode.commands.registerCommand(command, function () {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined === activeTextEditor) {
            vscode.window.showWarningMessage('Failed to generate getters and setters, cannot get the effective active text editor or selected java file');
            return;
        }

        var text = activeTextEditor.document.getText();
        var lines = text.split('\n');
        var generateCodes = '';
        for (var i in lines) {
            var line = lines[i].trim();
            // TODO 判断实例变量需要考虑多种场景
            if (line.startsWith('private') && line.endsWith(';') && !line.includes('static') && !line.includes('final')) {
                var tempWords = line.split(' ');
                var words = new Array();
                for (var j = 0, len = tempWords.length; j < len; j++) {
                    if ('' !== tempWords[j]) {
                        words.push(tempWords[j]);
                    }
                }
                var type = words[1];
                var parameterName = words[2];
                if (parameterName.includes('=')) {
                    parameterName = parameterName.substring(0, parameterName.indexOf('='))
                } else if (parameterName.endsWith(';')) {
                    parameterName = parameterName.substring(0, parameterName.length - 1);
                }
                var parameterInMethod = upperCaseFirstChar(parameterName);
                if (!text.includes('get' + parameterInMethod)) {
                    generateCodes += format(getterTemplate, type, parameterName, type, parameterInMethod, parameterName);
                }
                if (!text.includes('set' + parameterInMethod)) {
                    generateCodes += format(setterTemplate, parameterName, parameterName, parameterInMethod, type, parameterName, parameterName, parameterName);
                }
            }
        }
        if (generateCodes.length > 0) {
            var replaceLine;
            var start;
            var end;
            for (var k = lines.length - 1; k >= 0; k--) {
                if ('' === lines[k].trim()) {
                    continue;
                }
                replaceLine = k;
                start = lines[k].lastIndexOf('}');
                end = lines[k].length;
                break;
            }
            var range = new vscode.Range(replaceLine, start, replaceLine, end);
            let edits = [vscode.TextEdit.replace(range, '\n' + generateCodes + '}')];

            // Insert the text
            let uri = activeTextEditor.document.uri;
            let edit = new vscode.WorkspaceEdit();
            edit.set(uri, edits);
            vscode.workspace.applyEdit(edit);
        }
    });
    context.subscriptions.push(newCommand);
}

exports.FileType = FileType;

exports.newJavaFile = function(context, command, javaFileKeyWord) {
    var newJavaFile = vscode.commands.registerCommand(command, function (selectedFile) {
        vscode.window.showInputBox({
            prompt: "Create a " + javaFileKeyWord + " file",
            placeHolder: "Example: Test",
            ignoreFocusOut: true
        }).then(function (newJavaFilename) {
            if (undefined === newJavaFilename) {
                return;
            }
            // get active text editor
            var activeTextEditor = vscode.window.activeTextEditor;
            if (undefined === selectedFile && undefined === activeTextEditor) {
                vscode.window.showWarningMessage('Failed to create a new file, cannot get the effective active text editor or selected file!');
                return;
            }
            // the opened file`s path
            var newJavaFilePath = getDirectory(selectedFile.path || activeTextEditor.document.uri.path);
            if (checkNewFilename(newJavaFilename, newJavaFilePath)) {
                vscode.window.showWarningMessage('Failed to create a new file, duplicate file name!');
                return;
            }
            var javaPackageName = generatePackageName(newJavaFilePath);

            // new class file`s path
            newJavaFilePath +='/' + newJavaFilename + '.java';

            var content = format(classTemplate, javaPackageName, javaFileKeyWord, newJavaFilename);
            var options = {encoding: 'utf8'};
            fs.writeFile(newJavaFilePath, content, options, function() {
                vscode.workspace.openTextDocument(newJavaFilePath).then(function(doc) {
                    vscode.window.showTextDocument(doc);
                });
            });
        });
    });
    context.subscriptions.push(newJavaFile);
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

exports.copyQualifiedName = function (context, command) {
    var copyQualifiedName = vscode.commands.registerCommand(command, function (selectedFile) {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined === selectedFile && undefined === activeTextEditor) {
            vscode.window.showWarningMessage('Failed to copy qualified name, cannot get the effective active text editor or selected file!');
            return;
        }
        // the opened file`s path
        var javaFilePath = getJavaFilePath(selectedFile.path || activeTextEditor.document.uri.path);
        var qualifiedName = generatePackageName(javaFilePath);
        clipboardy.writeSync(qualifiedName);
    });
    context.subscriptions.push(copyQualifiedName);
}