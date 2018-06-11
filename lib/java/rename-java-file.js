// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const javaUtils = require('../util/java-utils');
const vscodeUtils = require('../util/vscode-utils');
const Logger = require('../log/logger');

exports.registerCommand = function(context, command) {
    Logger.debug('=============', __filename);
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function(event) {
        Logger.debug(event, __filename);
    }));
    var renameJavaFile = vscode.commands.registerCommand(command, function (selectedFile) {
        vscode.window.showInputBox({
            prompt: "New name",
            placeHolder: "Example: YouMayCallMeV",
            ignoreFocusOut: true
        }).then(function (newJavaFilename) {
            if (undefined === newJavaFilename) {
                vscode.window.showWarningMessage('Failed to rename the file, please input a new name!');
                return;
            }

            // get active text editor
            var activeTextEditor = vscode.window.activeTextEditor;
            if (undefined === selectedFile && undefined === activeTextEditor) {
                vscode.window.showWarningMessage('Failed to rename the file, cannot get the effective active text editor or selected file!');
                return;
            }
                console.log(vscodeUtils.nextTab());
            // the opened file`s path
            var currentJavaFilePath = javaUtils.getDirectory(selectedFile.path || activeTextEditor.document.uri.path);
            if (javaUtils.checkNewFilename(newJavaFilename, currentJavaFilePath)) {
                vscode.window.showWarningMessage('Failed to rename the file, duplicate file name!');
                return;
            }

            var javaPackageName = javaUtils.generatePackageName(currentJavaFilePath);

            // new class file`s path
            var newJavaFilePath = currentJavaFilePath + '/' + newJavaFilename + '.java';
            var oldJavaFilePath = javaUtils.getJavaFilePath(selectedFile.path || activeTextEditor.document.uri.path) + '.java';

            // fs.renameSync(oldJavaFilePath, newJavaFilePath);
            // vscode.window.showTextDocument(vscode.Uri.file(newJavaFilePath));
        });
    });
    context.subscriptions.push(renameJavaFile);
}

function replace(content) {

}
