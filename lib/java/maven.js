// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

const javaUtils = require('../util/java-utils');
const VscodeUtils = require('../util/vscode-utils');

var defaultGoals = VscodeUtils.getConfiguration('ide', 'mavenDefaultGoals');
const terminalName = 'ide-maven';
const userdataPath = '/.vscode/vscodeclipse.json';

var mavenTerminal;

exports.registerCommand = function (context, command) {
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function (event) {
        if (event.affectsConfiguration('ide.mavenDefaultGoals')) {
            defaultGoals = VscodeUtils.getConfiguration('ide', 'mavenDefaultGoals');
        }
    }));
    context.subscriptions.push(vscode.window.onDidCloseTerminal(function (terminal) {
        if (terminalName === terminal.name) {
            mavenTerminal = undefined;
        }
    }));
    var executeMavenGoal = vscode.commands.registerCommand(command, function (selectedFile) {
        var selectedProjectPath = javaUtils.getDirectory(selectedFile.path);
        var configPath = loadConfig(selectedProjectPath);
        var configContent = javaUtils.readFileToJson(configPath);
        var projectGoals = findHistoryGoal(configContent, selectedProjectPath);
        var tips = new Array();
        for (var i = 0; i < defaultGoals.length; i++) {
            tips.push({ label: defaultGoals[i], detail: selectedProjectPath });
        }
        if ('' !== projectGoals && projectGoals.length > 0) {
            for (var i = 0; i < projectGoals.length; i++) {
                tips.push({ label: projectGoals[i].label, detail: selectedProjectPath });
            }
        }
        tips.push({ label: 'Another Goal', detail: 'execute another goal' });
        vscode.window.showQuickPick(tips).then(function (selected) {
            if (undefined == selected) {
                return;
            }
            if (selected.label === 'Another Goal') {
                executeNewGoal(selectedProjectPath);
            } else {
                executeGoal(selected.label, selected.detail, selected.detail + '/pom.xml');
            }
        });
    });
    context.subscriptions.push(executeMavenGoal);
}

function loadConfig(selectedProjectPath) {
    var configPath = selectedProjectPath + '/.vscode';
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath);
        configPath = configPath + '/vscodeclipse.json';
        fs.writeFile(configPath, '');
    } else {
        configPath = configPath + '/vscodeclipse.json';
        if (!fs.existsSync(configPath)) {
            fs.writeFile(configPath, '');
        }
    }
    return configPath;
}

function findHistoryGoal(content, projectPath) {
    var jsonStr = '{"mavenHistory": {}}';
    var json = JSON.parse(jsonStr);
    if ('' === content || undefined === content || null == content) {
        content = json;
        content["mavenHistory"][projectPath] = [];
        fs.writeFileSync(projectPath + userdataPath, JSON.stringify(content, null, 4));
        return content["mavenHistory"][projectPath];
    }

    var mavenHistory = content["mavenHistory"];
    if ('' === mavenHistory || undefined === mavenHistory || null === mavenHistory) {
        content["mavenHistory"][projectPath] = [];
        fs.writeFileSync(projectPath + userdataPath, JSON.stringify(content, null, 4));
        return content["mavenHistory"][projectPath];
    }

    if (undefined === content["mavenHistory"][projectPath]) {
        content["mavenHistory"][projectPath] = [];
        fs.writeFileSync(projectPath + userdataPath, JSON.stringify(content, null, 4));
    }
    return content["mavenHistory"][projectPath];
}

function executeGoal(goals, projectPath, pomPath) {
    // concat command
    var command = 'mvn ' + goals + ' -f "' + pomPath + '"';
    // if not create terminal, then create and cache it
    if (undefined === mavenTerminal) {
        mavenTerminal = vscode.window.createTerminal(terminalName);
    }
    // show terminal
    mavenTerminal.show();
    // cd to the path of project
    mavenTerminal.sendText(changeDirectory(projectPath), true);
    // execute command
    mavenTerminal.sendText(command, true);
}

function executeNewGoal(selectedProjectPath) {
    vscode.window.showInputBox({
        prompt: "e.g. clean install",
        ignoreFocusOut: true
    }).then(function (goals) {
        executeGoal(goals, selectedProjectPath, selectedProjectPath + '/pom.xml');
        var configPath = loadConfig(selectedProjectPath);
        var configContent = javaUtils.readFileToJson(configPath);
        if (!checkDumplicatedGoal(configContent["mavenHistory"][selectedProjectPath], goals)) {
            configContent["mavenHistory"][selectedProjectPath].push({ "label": goals });
            fs.writeFileSync(selectedProjectPath + '/.vscode/vscodeclipse.json', JSON.stringify(configContent, null, 4));
        }
    });
}

function checkDumplicatedGoal(projectGoals, goal) {
    for (var i = 0; i < defaultGoals.length; i++) {
        if (goal === defaultGoals[i]) {
            return true;
        }
    }
    for (var i = 0; i < projectGoals.length; i++) {
        if (goal == projectGoals[i].label) {
            return true;
        }
    }
    return false;
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