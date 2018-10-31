// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const javaUtils = require('../util/java-utils');
const serviceErrorConst = require('./service-error-const');

// template for method of getter
var getterTemplate = '    /**\n'
                   + '     * @return {0} return the {1}\n'
                   + '     */\n'
                   + '    public {2} get{3}() {\n'
                   + '        return {4};\n'
                   + '    }\n\n';

// template for method of getter(boolean)
var getterTemplate4Bool = '    /**\n'
                   + '     * @return {0} return the {1}\n'
                   + '     */\n'
                   + '    public {2} is{3}() {\n'
                   + '        return {4};\n'
                   + '    }\n\n';

// template for method of setter
var setterTemplate = '    /**\n'
                   + '     * @param {0} the {1} to set\n'
                   + '     */\n'
                   + '    public void set{2}({3} {4}) {\n'
                   + '        this.{5} = {6};\n'
                   + '    }\n\n';

exports.registerCommand = function (context, command) {
    // regist commond
    var newCommand = vscode.commands.registerCommand(command, function () {
        // get active text editor
        var activeTextEditor = vscode.window.activeTextEditor;
        if (undefined === activeTextEditor) {
            vscode.window.showWarningMessage(JSON.stringify(serviceErrorConst.ERROR_0201));
            return;
        }

        // get text
        var text = activeTextEditor.document.getText();
        // split text by \n
        var lines = text.split('\n');
        var generateCodes = '';
        for (var i in lines) {
            var line = lines[i].trim();
            // field
            if (javaUtils.isClassParameter(line)) {
                // split line text by space
                var tempWords = line.split(' ');
                // filter empty elements in array
                var words = new Array();
                for (var j = 0, len = tempWords.length; j < len; j++) {
                    if ('' !== tempWords[j]) {
                        words.push(tempWords[j]);
                    }
                }

                // parameter's type
                var type = javaUtils.getTypeName(words);
                var parameterName = javaUtils.getParameterName(words);

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
