const saber = require('./lib/java/saber');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-java-saber" is now active!');

    saber.newJavaFile(context, 'extension.newAnnotationFile', saber.FileType.annotation);
    saber.newJavaFile(context, 'extension.newClassFile', saber.FileType.class);
    saber.newJavaFile(context, 'extension.newEnumFile', saber.FileType.enum);
    saber.newJavaFile(context, 'extension.newInterfaceFile', saber.FileType.interface);
    saber.generateGettersAndSetters(context, 'extension.generateGettersAndSetters');
    saber.copyQualifiedName(context, 'extension.copyQualifiedName');
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;