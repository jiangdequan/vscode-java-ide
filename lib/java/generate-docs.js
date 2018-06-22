const vscode = require('vscode');
const javaUtils = require('../util/java-utils');

exports.registerCommand = function (context, command) {
    var newCommand = vscode.commands.registerCommand(command, function () {
        const editor = vscode.window.activeTextEditor;
        var tt = editor.selections;
    });
}