// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const javaUtils = require('../util/java-utils');

var classTemplate = 'package {0};\n\n'
                  + 'public {1} {2} {\n'
                  + '    \n'
                  + '}';

var htmlTemplate = '<!DOCTYPE html>\n'
                 + '<html>\n'
                 + '<head>\n'
                 + '<meta charset="UTF-8">\n'
                 + '<title>Insert title here</title>\n'
                 + '<script type="text/javascript"></script>\n'
                 + '</head>\n'
                 + '<body>\n'
                 + '\n'
                 + '</body>\n'
                 + '</html>\n';

var jspTemplate = '<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>\n'
                  + '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n'
                  + '<html>\n'
                  + '<head>\n'
                  + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'
                  + '<title>Insert title here</title>\n'
                  + '</head>\n'
                  + '<body>\n'
                  + '\n'
                  + '</body>\n'
                  + '</html>\n';

exports.registerCommand = function(context, command, fileType) {
    var newJavaFile = vscode.commands.registerCommand(command, function (selectedFile) {
        vscode.window.showInputBox({
            prompt: "Please input a rule-compliant file name!",
            placeHolder: "Create a " + fileType._keyword + " file",
            ignoreFocusOut: true
        }).then(function (newJavaFilename) {
            if (undefined === newJavaFilename) {
                return;
            }
            // get active text editor
            var activeTextEditor = vscode.window.activeTextEditor;
            if (undefined === selectedFile && undefined === activeTextEditor) {
                vscode.window.showWarningMessage('Failed to create a new file, cannot get the effective active text editor or selected file!');
                return;
            }

            var selectedPath = '';
            if (undefined !== selectedFile && undefined !== selectedFile.path && '' !== selectedFile.path) {
                selectedPath = selectedFile.path;
            } else {
                selectedPath = activeTextEditor.document.uri.path;
            }

            // the opened file`s path
            var newJavaFilePath = javaUtils.getDirectory(selectedPath);
            if (javaUtils.checkNewFilename(newJavaFilename, newJavaFilePath, fileType._suffix)) {
                vscode.window.showWarningMessage('Failed to create a new file, duplicate file name!');
                return;
            }
            var javaPackageName = javaUtils.generatePackageName(newJavaFilePath);

            // new class file`s path
            newJavaFilePath +='/' + newJavaFilename + fileType._suffix;

            var content = '';
            if (fileType._type === 'jsp') {
                content = jspTemplate;
            } else if (fileType._type === 'html') {
                content = htmlTemplate;
            } else {
                content = javaUtils.format(classTemplate, javaPackageName, fileType._keyword, newJavaFilename);
            }
            var options = {encoding: 'utf8'};
            fs.writeFile(newJavaFilePath, content, options, function() {
                vscode.workspace.openTextDocument(newJavaFilePath).then(function(doc) {
                    vscode.window.showTextDocument(doc);
                });
            });
        });
    });
    context.subscriptions.push(newJavaFile);
}
