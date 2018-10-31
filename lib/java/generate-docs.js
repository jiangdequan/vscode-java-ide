const vscode = require('vscode');
const javaUtils = require('../util/java-utils');
const serviceErrorConst = require('./service-error-const');

/**
 * 
 * @param {*} context 
 * @param {*} command 
 */
exports.registerCommand = function (context, command) {
    var newCommand = vscode.commands.registerCommand(command, function () {
        const editor = vscode.window.activeTextEditor;

        // check editor
        if (undefined === editor) {
            vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0101));
            return;
        }

        var selections = editor.selections;
        // check selections
        if (null === selections || undefined === selections || selections.length === 0 || selections[0].isEmpty) {
            vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0102));
            return;
        }

        // check the select code
        if (selections[0].start.character > 0) {
            var leftTextRange = new vscode.Range(selections[0].start.line, 0, selections[0].start.line, selections[0].start.character);
            var leftText = editor.document.getText(leftTextRange);
            if (!isBlank(leftText)) {
                vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0103));
                return;
            }
        }

        // get the selected codes
        var rangeOfText = new vscode.Range(selections[0].start.line, 0, selections[0].end.line, selections[0].end.character);
        var selectedText = editor.document.getText(rangeOfText);
        if (!selectedText.trim().endsWith('{')) {
            vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0103));
            return;
        }
        // generate docs
        var docs = javaUtils.generateDocs(selectedText);

        // get replace range
        var range = new vscode.Range(selections[0].start.line, 0, selections[0].start.line, 0);
        let edits = [vscode.TextEdit.replace(range, docs)];

        // Insert the text
        let uri = editor.document.uri;
        let edit = new vscode.WorkspaceEdit();
        edit.set(uri, edits);
        vscode.workspace.applyEdit(edit);
    });
    context.subscriptions.push(newCommand);
}

function isBlank(obj) {
    if (undefined === obj || null === obj || '' === obj) {
        return true;
    }
    obj = obj.replace(/ /g, '');
    if ('' === obj) {
        return true;
    }
    return false;
}