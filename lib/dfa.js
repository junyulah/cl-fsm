'use strict';

let DFA = function() {
    // {state: {char: state}}
    this.transitionGraph = {};
}

DFA.prototype = {
    constructor: DFA,
    addTransition: function(from, letter, to) {
        this.transitionGraph[from] = this.transitionGraph[from] || {};
        this.transitionGraph[from][letter] = to;
    },

    transit: function(from, letter) {
        let transitionMap = this.transitionGraph[from];
        if (!transitionMap || transitionMap[letter] === undefined) return -1;
        return transitionMap[letter];
    }
}

module.exports = DFA;
