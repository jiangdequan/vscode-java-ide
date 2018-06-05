// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const clipboardy = require('clipboardy');
const javaUtils = require('../util/java-utils');

exports.registerCommand = function (context, command) {
    var copyQualifiedName = vscode.commands.registerCommand(command, function (selectedFile) {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined === selectedFile && undefined === activeTextEditor) {
            vscode.window.showWarningMessage('Failed to copy qualified name, cannot get the effective active text editor or selected file!');
            return;
        }

        var selectedPath = '';
        if (undefined !== selectedFile && undefined !== selectedFile.path && '' !== selectedFile.path) {
            selectedPath = selectedFile.path;
        } else {
            selectedPath = activeTextEditor.document.uri.path;
        }

        // the opened file`s path
        var javaFilePath = javaUtils.getJavaFilePath(selectedPath);
        var qualifiedName = javaUtils.generatePackageName(javaFilePath);
        clipboardy.writeSync(qualifiedName);
    });
    context.subscriptions.push(copyQualifiedName);
}