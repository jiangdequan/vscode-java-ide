// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const javaUtils = require('../util/java-utils');
var mavenTerminal;

exports.registerCommand = function (context, command) {
    var executeMavenGoal = vscode.commands.registerCommand(command, function (selectedFile) {
        var selectedProjectPath = javaUtils.getDirectory(selectedFile.path);
        var tips = new Array();
        tips.push({label: 'clean install -Dmaven.test.skip=true', detail: selectedProjectPath});
        tips.push({label: 'clean install', detail: selectedProjectPath});
        tips.push({label: 'Another Goal', detail: 'execute another goal'});
        vscode.window.showQuickPick(tips).then(function(selected) {
            if (selected.label === 'Another Goal') {
                executeNewGoal(selectedProjectPath)
            } else {
                executeGoal(selected.label, selected.detail, selected.detail + '/pom.xml');
            }
        });
    });
    context.subscriptions.push(executeMavenGoal);
}

function executeGoal(goals, projectPath, pomPath) {
    // concat command
    var command = 'mvn ' + goals + ' -f "' + pomPath + '"';
    // if not create terminal, then create and cache it
    if (undefined === mavenTerminal) {
        mavenTerminal = vscode.window.createTerminal('maven');
    }
    // show terminal
    mavenTerminal.show();
    // cd to the path of project
    mavenTerminal.sendText(projectPath, true);
    // execute command
    mavenTerminal.sendText(command, true);
}

function executeNewGoal(selectedProjectPath) {
    vscode.window.showInputBox({
        prompt: "e.g. clean install",
        ignoreFocusOut: true
    }).then(function (goals) {
        executeGoal(goals, selectedProjectPath, selectedProjectPath + '/pom.xml');
    });
}

function currentWindowsShell() {
    const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
    const system32Path = `${process.env.windir}\\${is32ProcessOn64Windows ? 'Sysnative' : 'System32'}`;
    const expectedLocations = {
        'Command Prompt': [`${system32Path}\\cmd.exe`],
        PowerShell: [`${system32Path}\\WindowsPowerShell\\v1.0\\powershell.exe`],
        'WSL Bash': [`${system32Path}\\bash.exe`],
        'Git Bash': [
            `${process.env.ProgramW6432}\\Git\\bin\\bash.exe`,
            `${process.env.ProgramW6432}\\Git\\usr\\bin\\bash.exe`,
            `${process.env.ProgramFiles}\\Git\\bin\\bash.exe`,
            `${process.env.ProgramFiles}\\Git\\usr\\bin\\bash.exe`,
            `${process.env.LocalAppData}\\Programs\\Git\\bin\\bash.exe`
        ]
    };
    const currentWindowsShellPath = vscode.workspace.getConfiguration("terminal").get("integrated.shell.windows");
    for (const key in expectedLocations) {
        if (expectedLocations[key].indexOf(currentWindowsShellPath) >= 0) {
            return key;
        }
    }
    return 'Others';
}

function toWSLPath(p) {
    const arr = p.split(":\\");
    if (arr.length === 2) {
        const drive = arr[0].toLowerCase();
        const dir = arr[1].replace(/\\/g, "/");
        return `/mnt/${drive}/${dir}`;
    } else {
        return ".";
    }
}

function changeDirectory(cwd) {
    if (process.platform !== "win32") {
        return `cd "${cwd}"`;
    }
    switch (currentWindowsShell()) {
        case 'Git Bash':
            // Git Bash: remove trailing '\'
            return `cd '${cwd.replace(/\\+$/, "")}'`;
        case 'PowerShell':
            // PowerShell
            return `cd "${cwd}"`;
        case 'Command Prompt':
            // CMD
            return `cd /d "${cwd}"`;
        case 'WSL Bash':
            // WSL
            return `cd "${toWSLPath(cwd)}"`;
        default:
            // Unknown, try using common one.
            return `cd "${cwd}"`;
    }
}