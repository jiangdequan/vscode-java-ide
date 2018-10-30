// [0001, 0100] for copy qualified name
exports.ERROR_0001 = {
    'code': '0001',
    'msg': 'Failed to invoke [copy qualified name], cannot get the effective active text editor or selected file!',
    'msg_zh': '复制类路径失败: 没有选中类或者打开的编辑器!'
};

// [0101, 0200] for generate docs
exports.ERROR_0101 = {
    'code': '0101',
    'msg': 'Failed to invoke [generate docs], cannot get the effective active text editor!',
    'msg_zh': '生成Java文档失败: 没有打开的编辑器!'
};
exports.ERROR_0102 = {
    'code': '0102',
    'msg': 'Failed to invoke [generate docs], no codes were selected to generate docs!',
    'msg_zh': '生成Java文档失败: 没有选中需要生成Java文档的代码!'
};

// [0201, 0300] for generate getters setters