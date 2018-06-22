// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const javaUtils = require('../util/java-utils');
const nodePath = require('path');
const fs = require('fs');
const sep = nodePath.sep;
const Logger = require('../log/logger');

exports.registerCommand = function (context, command) {
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function (event) {
        if (event.affectsConfiguration('ide.projectAutoSort')) {
            let config = vscode.workspace.getConfiguration('ide');
            if (config.get('projectAutoSort')) {
                sortByName();
            }
        }
        console.log(event.affectsConfiguration('ide.projectAutoSort'));
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(function (event) {
        let config = vscode.workspace.getConfiguration('ide');
        // add project & ide.projectAutoSort is true
        if (event.added.length != 0 && config.get('projectAutoSort')) {
            sortByName();
        }
    }));
    var sortWorkspace = vscode.commands.registerCommand(command, function () {
        sortByName();
    });
    context.subscriptions.push(sortWorkspace);
}

function sortByName() {
    var workspacePath = getWorkspacePath();
    var jsonContent = javaUtils.readFileToJson(workspacePath);
    if (undefined === jsonContent || '' === jsonContent) {
        return;
    }
    var sortedResult = {};
    var projects = new Array();
    for (var i = 0; i < jsonContent.folders.length; i++) {
        var folder = jsonContent.folders[i];
        if (folder.path.includes('\\')) {
            var projectName = folder.path.substring(folder.path.lastIndexOf('\\') + 1);
            sortedResult[projectName] = folder.path;
            projects.push(projectName);
        } else {
            sortedResult[folder.path] = folder.path;
            projects.push(folder.path);
        }
    }
    var result = new Array();
    for (var i = 0; i < projects.sort().length; i++) {
        var item = {};
        item["path"] = sortedResult[projects[i]];
        result.push(item);
    }
    jsonContent.folders = result;
    fs.writeFileSync(workspacePath, JSON.stringify(jsonContent, null, 4));
}

function sanitizedWorkspaceName(str) {
    return str.replace(/\s(\([^()]+\))$/, '');
}

function fileExists(path) {
    if (typeof path === 'string') {
        try {
            fs.accessSync(path);
            return true;
        } catch (ex) {
            // Unable to access the file
        }
    }
    return false;
}

function isCodeWorkspaceFile(path) {
    if (typeof path === 'string') {
        if (fileExists(path)) {
            let fileContent = fs.readFileSync(path, "utf-8");
            let wsObject = JSON.parse(fileContent);
            let projFolders = vscode.workspace.workspaceFolders;
            if (wsObject.folders && wsObject.folders.length === projFolders.length) {
                return true;
            }
        }
        return false;
    }
    throw new Error('Invalid argument path, expected string but got ' + typeof path);
}

function getWorkspacePath() {
    let name = sanitizedWorkspaceName(vscode.workspace.name);
    let workspaceFile = name + '.code-workspace';
    // No setting active? Get it from the folder-structure
    let visited = [];
    let projFolders = vscode.workspace.workspaceFolders;
    // Walk the project tree
    for (let projFolder of projFolders) {
        let folder = projFolder.uri.fsPath;
        // Visit all parent folders until we find the .code-workspace file
        while (folder.indexOf(sep) !== -1) {
            if (visited.indexOf(folder) == -1) {
                visited.push(folder);
                let path = nodePath.normalize(folder + sep + workspaceFile);
                if (isCodeWorkspaceFile(path)) {
                    return path;
                }
                folder = nodePath.normalize(folder + sep + '..' + sep);
            } else {
                break;
            }
        }
    }

    return '';
}