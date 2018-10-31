// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const clipboardy = require('clipboardy');
const javaUtils = require('../util/java-utils');
const serviceErrorConst = require('./service-error-const');

/**
 * Copy a class file`s full path. You can get it from a class file 
 * through right click or ctrl + shift + p and then typing 'copy qualified name'.
 * 
 * @param {*} context 
 * @param {*} command 
 */
exports.registerCommand = function (context, command) {
    var copyQualifiedName = vscode.commands.registerCommand(command, function (selectedFile) {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;

        // check
        if (undefined === selectedFile && undefined === activeTextEditor) {
            vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0001));
            return;
        }

        // get the path of selected file or active editor
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