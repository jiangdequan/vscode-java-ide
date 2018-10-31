// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const serviceErrorConst = require('./service-error-const');

exports.registerCommand = function (context, command) {
    var newFunctions = vscode.commands.registerCommand(command, function (selectedFile) {
        if (undefined === selectedFile || undefined === selectedFile.path) {
            vscode.window.showInformationMessage(JSON.stringify(serviceErrorConst.ERROR_0401));
            return;
        }
        var tips = new Array();
        tips.push({ label: 'Annotation' });
        tips.push({ label: 'Class' });
        tips.push({ label: 'Enum' });
        tips.push({ label: 'Interface' });
        tips.push({ label: 'Package' });
        tips.push({ label: 'HTML File' });
        tips.push({ label: 'JSP File' });
        var options = { placeHolder: 'Please select the type you want to creat', ignoreFocusOut: true };
        vscode.window.showQuickPick(tips, options).then(function (selectedTip) {
            if (undefined === selectedTip) {
                return;
            }
            if (selectedTip['label'] === 'Annotation') {
                vscode.commands.executeCommand('extension.newAnnotationFile', selectedFile);
            } else if (selectedTip['label'] === 'Class') {
                vscode.commands.executeCommand('extension.newClassFile', selectedFile);
            } else if (selectedTip['label'] === 'Enum') {
                vscode.commands.executeCommand('extension.newEnumFile', selectedFile);
            } else if (selectedTip['label'] === 'Interface') {
                vscode.commands.executeCommand('extension.newInterfaceFile', selectedFile);
            } else if (selectedTip['label'] === 'Package') {
                vscode.commands.executeCommand('extension.newPackage', selectedFile);
            } else if (selectedTip['label'] === 'HTML File') {
                vscode.commands.executeCommand('extension.newHtmlFile', selectedFile);
            } else if (selectedTip['label'] === 'JSP File') {
                vscode.commands.executeCommand('extension.newJspFile', selectedFile);
            }
        });
    });
    context.subscriptions.push(newFunctions);
}
