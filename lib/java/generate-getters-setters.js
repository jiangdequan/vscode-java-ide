// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const javaUtils = require('../util/java-utils');

var getterTemplate = '    /**\n'
                   + '     * @return {0} return the {1}\n'
                   + '     */\n'
                   + '    public {2} get{3}() {\n'
                   + '        return {4};\n'
                   + '    }\n\n';

var getterTemplate4Bool = '    /**\n'
                   + '     * @return {0} return the {1}\n'
                   + '     */\n'
                   + '    public {2} is{3}() {\n'
                   + '        return {4};\n'
                   + '    }\n\n';

var setterTemplate = '    /**\n'
                   + '     * @param {0} the {1} to set\n'
                   + '     */\n'
                   + '    public void set{2}({3} {4}) {\n'
                   + '        this.{5} = {6};\n'
                   + '    }\n\n';

exports.registerCommand = function (context, command) {
    var newCommand = vscode.commands.registerCommand(command, function () {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined === activeTextEditor) {
            vscode.window.showWarningMessage('Failed to generate getters and setters, cannot get the effective active text editor or selected java file');
            return;
        }

        var text = activeTextEditor.document.getText();
        var lines = text.split('\n');
        var generateCodes = '';
        for (var i in lines) {
            var line = lines[i].trim();
            // TODO 判断实例变量需要考虑多种场景
            if (line.startsWith('private') && line.endsWith(';') && !line.includes('static') && !line.includes('final')) {
                var tempWords = line.split(' ');
                var words = new Array();
                for (var j = 0, len = tempWords.length; j < len; j++) {
                    if ('' !== tempWords[j]) {
                        words.push(tempWords[j]);
                    }
                }
                var type = words[1];
                var parameterName = words[2];
                if (parameterName.includes('=')) {
                    parameterName = parameterName.substring(0, parameterName.indexOf('='))
                } else if (parameterName.endsWith(';')) {
                    parameterName = parameterName.substring(0, parameterName.length - 1);
                }
                var parameterInMethod = javaUtils.upperCaseFirstChar(parameterName);

                var getMethodName = 'get' + parameterInMethod;
                var getTemplate = getterTemplate;
                if (type === 'boolean' || type === 'Boolean') {
                    getMethodName = 'is' + parameterInMethod;
                    getTemplate = getterTemplate4Bool;
                }
                if (!text.includes(getMethodName)) {
                    generateCodes += javaUtils.format(getTemplate, type, parameterName, type, parameterInMethod, parameterName);
                }
                if (!text.includes('set' + parameterInMethod)) {
                    generateCodes += javaUtils.format(setterTemplate, parameterName, parameterName, parameterInMethod, type, parameterName, parameterName, parameterName);
                }
            }
        }
        if (generateCodes.length > 0) {
            var replaceLine;
            var start;
            var end;
            for (var k = lines.length - 1; k >= 0; k--) {
                if ('' === lines[k].trim()) {
                    continue;
                }
                replaceLine = k;
                start = lines[k].lastIndexOf('}');
                end = lines[k].length;
                break;
            }
            var range = new vscode.Range(replaceLine, start, replaceLine, end);
            let edits = [vscode.TextEdit.replace(range, '\n' + generateCodes + '}')];

            // Insert the text
            let uri = activeTextEditor.document.uri;
            let edit = new vscode.WorkspaceEdit();
            edit.set(uri, edits);
            vscode.workspace.applyEdit(edit);
        }
    });
    context.subscriptions.push(newCommand);
}
