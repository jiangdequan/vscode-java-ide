const FileType = require('../util/java-file-type');
const GenerateGettersAndSetters = require('./generate-getters-setters');
const NewJavaFile = require('./new-java-file');
const QualifiedName = require('./qualified-name');
const NewPackage = require('./new-package');

exports.registerCommand = function(context) {
    GenerateGettersAndSetters.registerCommand(context, 'extension.generateGettersAndSetters');
    NewJavaFile.registerCommand(context, 'extension.newAnnotationFile', FileType.Annotation._keyword);
    NewJavaFile.registerCommand(context, 'extension.newClassFile', FileType.Class._keyword);
    NewJavaFile.registerCommand(context, 'extension.newEnumFile', FileType.Enum._keyword);
    NewJavaFile.registerCommand(context, 'extension.newInterfaceFile', FileType.Interface._keyword);
    QualifiedName.registerCommand(context, 'extension.copyQualifiedName');
    NewPackage.registerCommand(context, 'extension.newPackage');
}
