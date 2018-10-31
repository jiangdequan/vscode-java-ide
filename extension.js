const saber = require('./lib/java/saber');
const LOGGER = require('./lib/log/logger');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    LOGGER.info('Congratulations, your extension "vscode-java-saber" is now active!', __filename);

    try {
        saber.registerCommand(context);
    } catch (error) {
        LOGGER.error(error, __filename);
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;