// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

exports.getConfiguration = function (section, name) {
    let config = vscode.workspace.getConfiguration(section);
    if (undefined === config) {
        return '';
    }
    return config.get(name);
}