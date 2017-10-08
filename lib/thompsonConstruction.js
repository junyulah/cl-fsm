'use strict';

let NFA = require('./nfa');
let ThompsonNFA = require('./thompsonNFA');

let ThompsonConstruction = function() {
    this.stateCount = 0;
};

ThompsonConstruction.prototype = {
    constructor: ThompsonConstruction,

    getNewState: function() {
        let v = this.stateCount;
        this.stateCount++;

        return v;
    },

    emptyExpression: function() {
        let nfa = new NFA();
        let state = this.getNewState();
        return new ThompsonNFA(nfa, state, state);
    },

    fracture: function() {
        let nfa = new NFA();
        let start = this.getNewState();
        let end = this.getNewState();

        return new ThompsonNFA(nfa, start, end);
    },

    symbol: function(letter) {
        let nfa = new NFA();
        let start = this.getNewState();
        let end = this.getNewState();

        nfa.addTransition(start, letter, end);

        return new ThompsonNFA(nfa, start, end);
    },

    unionExpression: function(...args) {
        let nfa = null,
            start = this.getNewState(),
            end = this.getNewState();

        let list = null;
        if (args.length > 1) {
            list = args;
        } else {
            list = args[0];
        }

        if (Array.isArray(list)) {
            for (let i = 0, n = list.length; i < n; i++) {
                let item = list[i];
                if (nfa === null) {
                    nfa = item.nfa;
                } else {
                    nfa.mergeNFA(item.nfa);
                }
                nfa.addEpsilonTransition(start, item.start);
                nfa.addEpsilonTransition(item.end, end);
            }
        } else if (list && typeof list === 'object') {
            nfa = new NFA();
            for (let letter in list) {
                nfa.addTransition(start, letter, end);
            }
        }

        return new ThompsonNFA(nfa, start, end);
    },

    concatExpression: function(n1, n2) {
        let nfa = n1.nfa;
        nfa.mergeNFA(n2.nfa);
        nfa.addEpsilonTransition(n1.end, n2.start);
        return new ThompsonNFA(nfa, n1.start, n2.end);
    },

    star: function(n) {
        let start = this.getNewState();
        let end = this.getNewState();
        let nfa = n.nfa;

        nfa.addEpsilonTransition(start, n.start);
        nfa.addEpsilonTransition(start, end);
        nfa.addEpsilonTransition(n.end, n.start);
        nfa.addEpsilonTransition(n.end, end);

        return new ThompsonNFA(nfa, start, end);
    }
};

module.exports = ThompsonConstruction;
