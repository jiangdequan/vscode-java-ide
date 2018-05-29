var FileType = function(type, keyword) {
    this._type = type;
    this._keyword = keyword;
}

exports.Annotation = new FileType('annotation', '@interface');
exports.Class = new FileType('class', 'class');
exports.Enum = new FileType('enum', 'enum');
exports.Interface = new FileType('interface', 'interface');