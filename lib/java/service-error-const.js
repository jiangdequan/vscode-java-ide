// service error codes

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
exports.ERROR_0103 = {
    'code': '0103',
    'msg': 'Failed to invoke [generate docs], please select { and its previous code!',
    'msg_zh': '生成Java文档失败: 请选中 { 及其前面的代码!'
};

// [0201, 0300] for generate getters setters
exports.ERROR_0201 = {
    'code': '0201',
    'msg': 'Failed to invoke [generate getters and setters], cannot get the effective active text editor!',
    'msg_zh': '生成getter/setter失败: 没有打开的编辑器!'
};

// [0301, 0400] for maven

// [0401, 0500] for new files
exports.ERROR_0401 = {
    'code': '0401',
    'msg': 'Failed to invoke [new java files], please right click on the place of the project!',
    'msg_zh': '生成文件失败: 请在左侧工作区, 右键点击需要创建新文件的位置!'
};
exports.ERROR_0402 = {
    'code': '0402',
    'msg': 'Failed to invoke [new java files], cannot get the effective active text editor or selected file!',
    'msg_zh': '生成文件失败: 没有选中文件或者打开的编辑器!'
};
exports.ERROR_0403 = {
    'code': '0403',
    'msg': 'Failed to invoke [new java files], duplicate file name!',
    'msg_zh': '生成文件失败: 文件名重复!'
};
exports.ERROR_0404 = {
    'code': '0404',
    'msg': 'Failed to invoke [new package], cannot get the typed package name or selected file!',
    'msg_zh': '生成包失败: 输入的包名为空或者未选中需要创建包位置!'
};
exports.ERROR_0405 = {
    'code': '0405',
    'msg': 'Failed to invoke [new package], the typed package name can not meet the rules of package!',
    'msg_zh': '生成包失败: 输入的报名不符合规范!'
};

// [0501, 0600] for 