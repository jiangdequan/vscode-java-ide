const vscode = require('vscode');
const javaUtils = require('../util/java-utils');

const docsTemplate = '/**\n *\n *\n */';

exports.registerCommand = function (context, command) {
    var newCommand = vscode.commands.registerCommand(command, function () {
        const editor = vscode.window.activeTextEditor;
        var selections = editor.selections;

        var rangeOfText = new vscode.Range(selections[0].start.line, selections[0].start.character, selections[0].end.line, selections[0].end.character);
        var selectedText = editor.document.getText(rangeOfText);
        console.log(selectedText);
        javaUtils.generateDocs(selectedText);

        var range = new vscode.Range(selections[0].start.line, selections[0].start.character, selections[0].start.line, selections[0].start.character);
        let edits = [vscode.TextEdit.replace(range, '\n' + docsTemplate + '\n')];

        // Insert the text
        let uri = editor.document.uri;
        let edit = new vscode.WorkspaceEdit();
        edit.set(uri, edits);
        vscode.workspace.applyEdit(edit);
    });
    context.subscriptions.push(newCommand);
}