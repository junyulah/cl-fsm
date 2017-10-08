'use strict';

let ThompsonConstruction = require('./thompsonConstruction');

let Parser = function() {
    this.tc = new ThompsonConstruction();
};

Parser.prototype = {
    constructor: Parser,
    OR_OP: '|',
    STAR_OP: '*',
    NOT_OP: '^',
    OPTION_OP: '?',
    VIRTUAL_CAT_OP: '1',
    ESCAPE_SYMBOL: '\\',
    LEFT_BRACKET: '(',
    RIGHT_BRACKET: ')',
    RANGE_START: '[',
    RANGE_MID: '-',
    RANGE_END: ']',

    OP_PRIORITY_MAP: {
        '|': 0,
        '?': 4,
        '*': 4,
        '1': 1
    },

    REG_HOLD_SYMBOLS: {
        '|': 1,
        '^': 1,
        '*': 1,
        '?': 1,
        '(': 1,
        ')': 1,
        '[': 1,
        '-': 1,
        ']': 1
    },

    isNormalLetter: function(letter) {
        return letter === this.ESCAPE_SYMBOL || this.REG_HOLD_SYMBOLS[letter] === undefined;
    },

    runUnionOp: function(valueStack) {
        // TODO exception
        let c1 = valueStack.pop();
        let c2 = valueStack.pop();
        valueStack.push(this.tc.unionExpression(c2, c1));
    },

    runConcatOp: function(valueStack) {
        let c1 = valueStack.pop();
        let c2 = valueStack.pop();
        valueStack.push(this.tc.concatExpression(c2, c1));
    },

    runStarOp: function(valueStack) {
        let c = valueStack.pop();
        valueStack.push(this.tc.star(c));
    },

    runOptionOp: function(valueStack) {
        let c = valueStack.pop();
        valueStack.push(this.tc.unionExpression(c, this.tc.emptyExpression()));
    },

    rangeToNFA: function(rangeSet) {
        return this.tc.unionExpression(rangeSet);
    },

    // char hold 0-127
    notToNFA: function(letters) {
        let charset = {};
        for (let i = 0; i < 128; i++) {
            let ch = String.fromCharCode(i);
            if (letters[ch] === undefined) {
                charset[ch] = 1;
            }
        }

        return this.tc.unionExpression(charset);
    },

    isNextConcated: function(currentLetter, nextLetter) {
        return !(nextLetter == this.STAR_OP || //...*
            nextLetter == this.OPTION_OP || // ...?
            nextLetter == this.OR_OP || // ...|
            nextLetter == this.RIGHT_BRACKET || // ...)
            currentLetter == this.LEFT_BRACKET || // (..
            currentLetter == this.OR_OP // |...
        );
    },

    reduceOpsStack: function(valueStack, ops) {
        while (ops.length) {
            let top = ops[ops.length - 1];
            switch (top) {
                case this.OR_OP:
                    ops.pop();
                    this.runUnionOp(valueStack);
                    break;
                case this.VIRTUAL_CAT_OP:
                    ops.pop();
                    this.runConcatOp(valueStack);
                    break;
                case this.STAR_OP:
                    ops.pop();
                    this.runStarOp(valueStack);
                    break;
                case this.OPTION_OP:
                    ops.pop();
                    this.runOptionOp(valueStack);
                    break;
                case this.LEFT_BRACKET:
                    return true;
            }
        }

        return false;
    },

    pushOp: function(opLetter, valueStack, ops) {
        // before push OP, compare the priority to reduce op stack.

        if (ops.length) {
            let top = ops[ops.length - 1];
            if (this.OP_PRIORITY_MAP[top] > this.OP_PRIORITY_MAP[opLetter]) {
                this.reduceOpsStack(valueStack, ops);
            }
        }

        ops.push(opLetter);
    },

    getRange: function(start, end) {
        let charset = {};

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);
        if (end < start) {
            throw new Error('Range out of order.');
        }

        for (let i = start; i <= end; i++) {
            charset[String.fromCharCode(i)] = 1;
        }

        return charset;
    },

    throwSyntaxError: function(regExp, errorIndex, msg) {
        let prev = errorIndex > 0 ? regExp.substring(Math.max(errorIndex - 5, 0), errorIndex) : '';
        let after = errorIndex < regExp.length - 1 ?
            regExp.substring(errorIndex + 1, Math.min(regExp.length, errorIndex + 5)) : '';

        throw new Error("[Parsing RegExp error], error position " + errorIndex +
            ". Arround string is '" + prev +
            "  >>>" + regExp[errorIndex] + "<<<  " + after + "'." + msg);
    },

    // [0-9] [abcd] [0-9a-f]
    parseRange: function(regExp, index) { // regExp[index] is '['
        let ranges = [];
        let regExpSize = regExp.length;
        let offset = 0;

        index++; // next one after '['
        let meetEnd = false;

        while (index < regExpSize) {
            if (regExp[index] === this.RANGE_END) {
                offset++;
                meetEnd = true; // meet end
                break;
            } else {
                let start = regExp[index];
                if (start === this.ESCAPE_SYMBOL) {
                    start = this.getEscapedLetter(regExp, index);
                    index++;
                    offset++;
                } else if (!this.isNormalLetter(start)) {
                    this.throwSyntaxError(regExp, index,
                        "Uncorrect range. Range grammer is like [0-9].");
                }

                if (index < regExpSize - 2 && regExp[index + 1] === this.RANGE_MID) {
                    let end = regExp[index + 2];
                    if (end === this.ESCAPE_SYMBOL) {
                        end = this.getEscapedLetter(regExp, index);
                        index++;
                        offset++;
                    } else if (!this.isNormalLetter(end)) {
                        this.throwSyntaxError(regExp, index + 2,
                            "Uncorrect range. Range grammer is like [0-9].");
                    }

                    ranges.push(this.getRange(start, end));
                    index += 2;
                    offset += 2;
                } else {
                    ranges.push({
                        [regExp[index]]: 1
                    });
                }
            }

            offset++;
            index++;
        }

        if (!meetEnd) {
            this.throwSyntaxError(regExp, index,
                "Uncorrect range. Range grammer is like [0-9].");

        }

        let range = {};
        for (let i = 0, n = ranges.length; i < n; i++) {
            let item = ranges[i];
            for (let name in item) {
                range[name] = 1;
            }
        }

        return {
            range,
            offset
        };
    },

    getEscapedLetter: function(regExp, index) { // regExp[index] = '\\'
        let regExpSize = regExp.length;
        if (index >= regExpSize - 1) {
            this.throwSyntaxError(regExp, index, 'missing letter to escape.');
        }

        return regExp[index + 1];
    },

    // TODO error
    // TODO string to charlist
    parse: function(regExp) {
        let regExpSize = regExp.length;
        if (regExpSize == 0) {
            return this.tc.emptyExpression();
        }

        let valueStack = [],
            ops = [];

        let index = 0;
        let partial = {};

        while (index < regExpSize) {
            let letter = regExp[index];
            switch (letter) {
                case this.ESCAPE_SYMBOL:
                    valueStack.push(this.tc.symbol(this.getEscapedLetter(regExp, index)));
                    index++;
                    break;

                case this.RANGE_START: // TODO more powerful
                    // TODO Exception checking
                    partial = this.parseRange(regExp, index);
                    index += partial.offset;
                    valueStack.push(this.rangeToNFA(partial.range));
                    break;

                case this.NOT_OP: // TODO more powerful
                    if (index >= regExpSize - 1 ||
                        (!this.isNormalLetter(regExp[index + 1]) && regExp[index + 1] !== this.RANGE_START)) {
                        throw new Error('Uncorrect not. Not grammer is like ^a.');
                    }

                    if (regExp[index + 1] === this.RANGE_START) {
                        index++;
                        partial = this.parseRange(regExp, index);
                        index += partial.offset;
                        valueStack.push(this.notToNFA(partial.range));
                    } else {
                        valueStack.push(this.notToNFA({
                            [regExp[index + 1]]: 1
                        }));
                        index++; // forward
                    }

                    break;

                    // infix operations
                case this.OR_OP:
                    this.pushOp(letter, valueStack, ops);
                    break;
                case this.STAR_OP:
                    this.pushOp(letter, valueStack, ops);
                    break;
                case this.OPTION_OP:
                    this.pushOp(letter, valueStack, ops);
                    break;

                    // brackets
                case this.LEFT_BRACKET:
                    ops.push(letter);
                    break;

                case this.RIGHT_BRACKET:
                    // pop ops untitl meeting left bracket
                    if (!this.reduceOpsStack(valueStack, ops)) {
                        this.throwSyntaxError(regExp, index, 'Bracket "()" does not close correctly.');
                    } else {
                        ops.pop(); // pop left bracket
                    }
                    break;
                default:
                    valueStack.push(this.tc.symbol(letter));
                    break;
            }

            // consider concat operation

            if (index < regExpSize - 1) { // if exists more letters
                let nextLetter = regExp[index + 1];
                if (this.isNextConcated(letter, nextLetter)) {
                    this.pushOp(this.VIRTUAL_CAT_OP, valueStack, ops);
                }
            }

            index++;
        }

        // if still remains some ops

        this.reduceOpsStack(valueStack, ops);

        return valueStack.pop(); // last one
    }
};

module.exports = Parser;
