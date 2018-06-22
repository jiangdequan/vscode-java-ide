const FileType = require('../util/java-file-type');
const GenerateGettersAndSetters = require('./generate-getters-setters');
const NewJavaFile = require('./new-java-file');
const QualifiedName = require('./copy-qualified-name');
const NewPackage = require('./new-package');
const SortWorkspace = require('./sort-workspace');
const ExecuteMavenGoal = require('./maven');

const NewFunctions = require('./new-functions');

const RenameJavaFile = require('./rename-java-file');

exports.registerCommand = function(context) {
    // generate getters and setters
    GenerateGettersAndSetters.registerCommand(context, 'extension.generateGettersAndSetters');

    // new java file
    NewJavaFile.registerCommand(context, 'extension.newAnnotationFile', FileType.Annotation);
    NewJavaFile.registerCommand(context, 'extension.newClassFile', FileType.Class);
    NewJavaFile.registerCommand(context, 'extension.newEnumFile', FileType.Enum);
    NewJavaFile.registerCommand(context, 'extension.newInterfaceFile', FileType.Interface);
    NewJavaFile.registerCommand(context, 'extension.newHtmlFile', FileType.HTML);
    NewJavaFile.registerCommand(context, 'extension.newJspFile', FileType.JSP);
    NewPackage.registerCommand(context, 'extension.newPackage');

    // copy qualified name
    QualifiedName.registerCommand(context, 'extension.copyQualifiedName');

    // sort projects by name
    SortWorkspace.registerCommand(context, 'extension.sortWorkspace');

    ExecuteMavenGoal.registerCommand(context, 'extension.executeMavenGoal');
    // RenameJavaFile.registerCommand(context, '');

    NewFunctions.registerCommand(context, 'extension.newFunctions');
}
