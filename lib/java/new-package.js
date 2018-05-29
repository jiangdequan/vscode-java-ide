// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const javaUtils = require('../util/java-utils');

exports.registerCommand = function(context, command) {
    var newPackage = vscode.commands.registerCommand(command, function (selectedFile) {
        vscode.window.showInputBox({
            prompt: "Create packages based on what you typed",
            placeHolder: "Example: io.jiangdequan.github",
            ignoreFocusOut: true
        }).then(function (typedPackageName) {
            if (undefined === typedPackageName || undefined === selectedFile) {
                return;
            }
            if (!javaUtils.checkPackageName(typedPackageName)) {
                return;
            }
            var selectedPath = javaUtils.getDirectory(selectedFile.path);
            var newPackages = typedPackageName.split('.');
            for (var i = 0; i < newPackages.length; i++) {
                selectedPath += '/' + newPackages[i];
                if (!fs.existsSync(selectedPath)) {
                    fs.mkdirSync(selectedPath);
                }
            }
        });
    });
    context.subscriptions.push(newPackage);
}