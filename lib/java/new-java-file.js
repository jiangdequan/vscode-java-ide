// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const javaUtils = require('../util/java-utils');

var classTemplate = 'package {0};\n\n'
                  + 'public {1} {2} {\n'
                  + '    \n'
                  + '}';

exports.registerCommand = function(context, command, javaFileKeyWord) {
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

            var selectedPath = '';
            if (undefined !== selectedFile && undefined !== selectedFile.path && '' !== selectedFile.path) {
                selectedPath = selectedFile.path;
            } else {
                selectedPath = activeTextEditor.document.uri.path;
            }

            // the opened file`s path
            var newJavaFilePath = javaUtils.getDirectory(selectedPath);
            if (javaUtils.checkNewFilename(newJavaFilename, newJavaFilePath)) {
                vscode.window.showWarningMessage('Failed to create a new file, duplicate file name!');
                return;
            }
            var javaPackageName = javaUtils.generatePackageName(newJavaFilePath);

            // new class file`s path
            newJavaFilePath +='/' + newJavaFilename + '.java';

            var content = javaUtils.format(classTemplate, javaPackageName, javaFileKeyWord, newJavaFilename);
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
