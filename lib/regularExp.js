'use strict';

let Parser = require('./parser');

let RegularExp = function(exp) {
    let parser = new Parser();
    let tnfa = parser.parse(exp);
    let end = tnfa.end;
    let {
        dfa,
        stateMap
    } = tnfa.nfa.toDFA(tnfa.start);

    this.dfa = dfa;
    this.ends = {};

    for (let state in stateMap) {
        let stateSet = stateMap[state];
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
            let letter = tar[i];
            let targetState = this.dfa.transit(curState, letter);

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
