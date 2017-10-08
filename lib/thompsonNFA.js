'use strict';

let ThompsonNFA = function(nfa, start, end) {
    this.nfa = nfa;
    this.start = start;
    this.end = end;
};

ThompsonNFA.prototype = {
    constructor: ThompsonNFA
};

module.exports = ThompsonNFA;
