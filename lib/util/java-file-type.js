var FileType = function(type, keyword, suffix) {
    this._type = type;
    this._keyword = keyword;
    this._suffix = suffix;
}

exports.Annotation = new FileType('annotation', '@interface', '.java');
exports.Class = new FileType('class', 'class', '.java');
exports.Enum = new FileType('enum', 'enum', '.java');
exports.Interface = new FileType('interface', 'interface', '.java');

exports.JSP = new FileType('jsp', 'jsp', '.jsp');
exports.HTML = new FileType('html', 'html', '.html');