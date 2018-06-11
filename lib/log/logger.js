/*
    A simple util to print log by _YouMayCallMeV_.
 */

var Color = {
    "reset": "\x1b[0m",
    "black": "\x1b[30m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "white": "\x1b[37m",
    "blackBg": "\x1b[40m",
    "redBg": "\x1b[41m",
    "greenBg": "\x1b[42m",
    "yellowBg": "\x1b[43m",
    "blueBg": "\x1b[44m",
    "magentaBg": "\x1b[45m",
    "cyanBg": "\x1b[46m",
    "whiteBg": "\x1b[47m"
};

var FontStyle = {
    "bold": "\x1b[1m",
    "boldClear": "\x1b[22m",
    "italic": "\x1b[3m",
    "italicClear": "\x1b[23m",
    "underline": "\x1b[4m",
    "underlineClear": "\x1b[24m",
    "inverse": "\x1b[7m",
    "inverseClear": "\x1b[27m",
    "srikethrough": "\x1b[9m",
    "srikethroughClear": "\x1b[29m"
};

var Logger = function Logger(key, level, color, colorBg, fontStyle, fontStyleClear) {
    this._key = key;
    this._level = level;
    this._color = color;
    this._colorBg = colorBg;
    this._fontStyle = fontStyle;
    this._fontStyleClear = fontStyleClear;
    this._reset = Color.reset;
}

Logger.prototype.log = function (filename, msg) {
    if (this._level >= defaultLevel._level && defaultLevel._level != Level.OFF._level && this._level != Level.OFF._level) {
        console.log('%s%s%s||-[%s][%s][%s] %s%s%s', this._color, this._colorBg, this._fontStyle, getCurrentDate(), this._key, filename, msg, this._reset, this._fontStyleClear);
    }
}

var Level = {
    "ALL": new Logger('ALL', 0, '', '', '', ''),
    "TRACE": new Logger('TRACE', 1, '', '', '', ''),
    "DEBUG": new Logger('DEBUG', 2, Color.green, '', '', ''),
    "INFO": new Logger('INFO', 3, Color.white, '', '', ''),
    "WARN": new Logger('WARN', 4, Color.yellow, '', '', ''),
    "ERROR": new Logger('ERROR', 5, Color.red, '', '', ''),
    "FATAL": new Logger('FATAL', 6, Color.black, Color.redBg, FontStyle.bold, FontStyle.boldClear),
    "MARK": new Logger('MARK', 7, '', '', '', ''),
    "OFF": new Logger('OFF', 8, '', '', '', '')
};

var defaultLevel = Level.DEBUG;

var initLogLevel = function (level) {
    for (var l in Level) {
        if (l === level) {
            defaultLevel = Level[l];
            return;
        }
    }
}

var info = function (msg, filename) {
    Level.INFO.log(getFilename(filename), msg);
}

var debug = function (msg, filename) {
    Level.DEBUG.log(getFilename(filename), msg);
}

var error = function (msg, filename) {
    Level.ERROR.log(getFilename(filename), msg);
}

var warn = function (msg, filename) {
    Level.WARN.log(getFilename(filename), msg);
}

var verbose = function (msg, filename) {
    Level.FATAL.log(getFilename(filename), msg);
}

function getFilename(filename) {
    return filename.substring(filename.lastIndexOf('\\') + 1);
}

function getCurrentDate() {
    return new Date().Format("yyyy-MM-dd hh:mm:ss.S");
}

Date.prototype.Format = function (fmt) {

    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

exports.info = info;
exports.debug = debug;
exports.error = error;
exports.warn = warn;
exports.verbose = verbose;
exports.initLogLevel = initLogLevel;
