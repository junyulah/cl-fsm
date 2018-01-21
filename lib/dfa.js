'use strict';

const DFA = function() {
    // {state: {char: state}}
    this.transitionGraph = {};
};

DFA.prototype = {
    constructor: DFA,

    addTransition: function(from, letter, to) {
        this.transitionGraph[from] = this.transitionGraph[from] || {};
        this.transitionGraph[from][letter] = to;
    },

    /**
     * @param from from state
     * @param letter
     *
     * @return toState or -1
     */
    transit: function(from, letter) {
        const transitionMap = this.transitionGraph[from];
        if (!transitionMap || transitionMap[letter] === undefined) return -1;
        return transitionMap[letter];
    }
};

module.exports = DFA;
