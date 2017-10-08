const RegularExp = require('./regularExp');

const jsonStringExpStr = "\"(^[\"\\\\]|\\\\([\"\\\\/bfnrt]|u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]))*\"";
const jsonNumberExpStr = "-?(0|[1-9][0-9]*)(.[0-9][0-9]*)?([eE][\\+\\-]?[0-9][0-9]*)?";

module.exports = {
    jsonStringExpStr,
    jsonNumberExpStr,
    jsonStringExp: new RegularExp(jsonStringExpStr),
    jsonNumberExp: new RegularExp(jsonNumberExpStr)
};
