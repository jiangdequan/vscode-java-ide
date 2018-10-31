const FileType = require('../util/java-file-type');

const QualifiedName = require('./copy-qualified-name');

const GenerateGettersAndSetters = require('./generate-getters-setters');

const SortWorkspace = require('./sort-workspace');

const ExecuteMavenGoal = require('./maven');

const GenerateDocs = require('./generate-docs');

const NewJavaFile = require('./new-java-file');
const NewPackage = require('./new-package');
const NewFunctions = require('./new-functions');

const RenameJavaFile = require('./rename-java-file');

/**
 * regist command
 */
exports.registerCommand = function(context) {
    // generate getters and setters
    GenerateGettersAndSetters.registerCommand(context, 'extension.generateGettersAndSetters');

    // generate Docs
    GenerateDocs.registerCommand(context, 'extension.generateDocs');

    // copy qualified name
    QualifiedName.registerCommand(context, 'extension.copyQualifiedName');

    // sort projects by name
    SortWorkspace.registerCommand(context, 'extension.sortWorkspace');

    // maven goals
    ExecuteMavenGoal.registerCommand(context, 'extension.executeMavenGoal');
    
    NewJavaFile.registerCommand(context, 'extension.newAnnotationFile', FileType.Annotation);
    NewJavaFile.registerCommand(context, 'extension.newClassFile', FileType.Class);
    NewJavaFile.registerCommand(context, 'extension.newEnumFile', FileType.Enum);
    NewJavaFile.registerCommand(context, 'extension.newInterfaceFile', FileType.Interface);
    NewJavaFile.registerCommand(context, 'extension.newHtmlFile', FileType.HTML);
    NewJavaFile.registerCommand(context, 'extension.newJspFile', FileType.JSP);
    NewPackage.registerCommand(context, 'extension.newPackage');

    // new java file
    NewFunctions.registerCommand(context, 'extension.newFunctions');
}
