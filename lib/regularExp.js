'use strict';

const Parser = require('./parser');

const RegularExp = function(exp) {
    const parser = new Parser();
    const tnfa = parser.parse(exp);
    const end = tnfa.end;
    const {
        dfa,
        stateMap
    } = tnfa.nfa.toDFA(tnfa.start);

    this.dfa = dfa;
    this.ends = {};

    for (const state in stateMap) {
        const stateSet = stateMap[state];
        if (stateSet[end] !== undefined) {
            this.ends[state] = 1;
        }
    }
};

RegularExp.prototype = {
    constructor: RegularExp,
    getStartState: function() {
        return 0;
    },

    test: function(tar) {
        let curState = this.getStartState();

        for (let i = 0, n = tar.length; i < n; i++) {
            const targetState = this.dfa.transit(curState, tar[i]);

            if (targetState === -1) {
                return false;
            } else {
                curState = targetState;
            }
        }

        if (this.ends[curState] === undefined) { // not accept state
            return false;
        }

        return true;
    },

    transit: function(state, letter) {
        return this.dfa.transit(state, letter);
    },

    isEndState: function(state) {
        return this.ends[state] !== undefined;
    },

    isErrorState: function(state) {
        return state === -1;
    }
};

module.exports = RegularExp;
