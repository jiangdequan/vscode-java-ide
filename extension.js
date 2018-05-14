// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

const mavenProject = '/src/main/java/';
const javaProject = '/src/';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-java-saber" is now active!');

    registerNewJavaFile(context, 'extension.newAnnotationFile', '@interface');
    registerNewJavaFile(context, 'extension.newClassFile', 'class');
    registerNewJavaFile(context, 'extension.newEnumFile', 'enum');
    registerNewJavaFile(context, 'extension.newInterfaceFile', 'interface');

    registerNewCommand(context, 'extension.generateGettersAndSetters', function() {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined == activeTextEditor) {
            vscode.window.showWarningMessage('Failed to generate getters and setters, cannot get the effective active text editor');
            return;
        }

        var text = activeTextEditor.document.getText();
        var lines = text.split('\n');
        var generateCodes = '';
        for (var i in lines) {
            var line = lines[i].trim();
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
                } else if(parameterName.endsWith(';')) {
                    parameterName = parameterName.substring(0, parameterName.length - 1);
                }
                var parameterInMethod = upperCaseFirstChar(parameterName);
                if (!text.includes('get' + parameterInMethod)) {
                    generateCodes += '    /**\n     * @return ' + parameterName + ' return the ' + parameterName + '\n     */\n    public ' + type + ' get' + parameterInMethod + '() {\n        return ' + parameterName + ';\n    }\n\n';
                }
                if (!text.includes('set' + parameterInMethod)) {
                    generateCodes += '    /**\n     * @param ' + parameterName + ' the ' + parameterName + ' to set\n     */\n    public void set' + parameterInMethod + '(' + type + ' ' + parameterName + ') {\n        this.' + parameterName + ' = ' + parameterName + ';\n    }\n\n'
                }
            }
        }
        if (generateCodes.length > 0) {
            var replaceLine;
            var start;
            var end;
            for (var k = lines.length - 1; k >= 0; k--) {
                if('' === lines[k].trim()) {
                    continue;
                }
                replaceLine = k;
                start = lines[k].lastIndexOf('}');
                end = lines[k].length - 1;
                break;
            }
            var range = new vscode.Range(replaceLine, start, replaceLine, end);
            let edits = [vscode.TextEdit.replace(range, '\n' + generateCodes + '}')];

            // Insert the text
            let uri = activeTextEditor.document.uri;
            let edit = new vscode.WorkspaceEdit();
            edit.set(uri, edits);
            vscode.workspace.applyEdit(edit);
            console.log('=====================');
        }
    });
}
exports.activate = activate;

function upperCaseFirstChar(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function registerNewCommand(context, command, callback) {
    var newCommand = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(newCommand);
}

function registerNewJavaFile(context, command, javaFileKeyWord) {
    var createJavaFile = vscode.commands.registerCommand(command, function () {
        vscode.window.showInputBox({
            prompt: "Create a " + javaFileKeyWord + " file",
            placeHolder: "Example: Test",
            ignoreFocusOut: true
        }).then(function (newJavaFilename) {
            // get active text editor
            var activeTextEditor = vscode.window.activeTextEditor;
            if (undefined == activeTextEditor) {
                vscode.window.showWarningMessage('Failed to create a new file, cannot get the effective active text editor');
                return;
            }
            // the opened file`s path
            var fsPath = activeTextEditor.document.uri.path;
            fsPath = fsPath.substring(0, fsPath.lastIndexOf('/') + 1);
            var javaPackageName = generatePackageName(fsPath);
            // new class file`s path
            fsPath += newJavaFilename + '.java';

            var data = 'package ' + javaPackageName + ';\n\npublic ' + javaFileKeyWord + ' ' + newJavaFilename + ' {\n\n}';
            var options = {encoding: 'utf8'};
            fs.writeFile(fsPath.substring(1), data, options, function() {
                vscode.workspace.openTextDocument(fsPath.substring(1)).then(function(doc) {
                    vscode.window.showTextDocument(doc);
                });
            });
        });
    });
    context.subscriptions.push(createJavaFile);
}

function generatePackageName(path) {
    // get project name from workspace
    var projectName = '';
    var workspaceFolders = vscode.workspace.workspaceFolders;
    for (var workspaceFolder in workspaceFolders) {
        if (path.indexOf(workspaceFolders[workspaceFolder].name) > 0) {
            projectName = workspaceFolders[workspaceFolder].name;
            break;
        }
    }

    // project name and maven folders
    var packagePrefix = projectName + mavenProject;
    var start = path.lastIndexOf(packagePrefix);

    // maven project
    if (start > 0) {
        return path.substring(start + packagePrefix.length, path.length - 1).replace(/\//g, '.');
    }

    // java project
    packagePrefix = projectName + javaProject;
    start = path.lastIndexOf(packagePrefix);
    if (start > 0) {
        return path.substring(start + packagePrefix.length, path.length - 1).replace(/\//g, '.');
    }

    return 'io.github.jiangdequan';
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;