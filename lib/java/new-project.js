// TODO
const vscode = require('vscode');
const fs = require('fs');
const javaUtils = require('../util/java-utils');

exports.registerCommand = function(context, command, fileType) {
    var newProject = vscode.commands.registerCommand(command, function (selectedFile) {
        var tips = new Array();
        tips.push({ label: 'Maven' });
        tips.push({ label: 'Java' });
        tips.push({ label: 'Folder' });
        var options = { placeHolder: 'Please select the type you want to create', ignoreFocusOut: true };
        vscode.window.showQuickPick(tips, options).then(function (selectedTip) {
            if (undefined === selectedTip) {
                return;
            }
            if (selectedTip['label'] === 'Maven') {
                vscode.commands.executeCommand('extension.newAnnotationFile', selectedFile);
            } else if (selectedTip['label'] === 'Java') {
                vscode.commands.executeCommand('extension.newClassFile', selectedFile);
            } else if (selectedTip['label'] === 'Folder') {
                vscode.commands.executeCommand('extension.newClassFile', selectedFile);
            }
        });
    });
    context.subscriptions.push(newProject);
}