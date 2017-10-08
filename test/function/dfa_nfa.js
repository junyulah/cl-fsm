'use strict';

let DFA = require('../../lib/dfa');
let NFA = require('../../lib/NFA');

let assert = require('assert');

describe('dfa_nfa', () => {
    it('toDFA:0', () => {
        let nfa1 = new NFA();
        let tar1 = new DFA();
        assert.deepEqual(nfa1.toDFA(0).dfa.transitionGraph, tar1.transitionGraph);
    });

    it('toDFA:1', () => {
        let nfa = new NFA();
        nfa.addTransition(0, 'a', 1);
        nfa.addTransition(0, 'b', 2);
        nfa.addTransition(1, 'c', 3);
        nfa.addTransition(2, 'd', 4);
        assert.deepEqual(nfa.toDFA(0).dfa.transitionGraph, {
            '0': {
                a: 1,
                b: 2
            },
            '1': {
                c: 3
            },
            '2': {
                d: 4
            }
        });
    });

    it('toDFA: contains set', () => {
        let nfa = new NFA();
        nfa.addTransition(0, 'a', 1);
        nfa.addTransition(0, 'b', 2);
        nfa.addTransition(1, 'c', 3);
        nfa.addTransition(2, 'd', 4);
        nfa.addTransition(2, 'd', 3);
        assert.deepEqual(nfa.toDFA(0).dfa.transitionGraph, {
            '0': {
                a: 1,
                b: 2
            },
            '1': {
                c: 3
            },
            '2': {
                d: 4
            }
        });
    });

    it('toDFA: contains epsilon', () => {
        let nfa = new NFA();

        nfa.addTransition(0, 'a', 1);
        nfa.addTransition(0, 'a', 2);
        nfa.addTransition(1, 'b', 3);
        nfa.addEpsilonTransition(1, 4);
        nfa.addTransition(4, 'c', 5);
        nfa.addTransition(4, 'd', 6);

        assert.deepEqual(nfa.toDFA(0).dfa.transitionGraph, {
            '0': {
                a: 1
            },
            '1': {
                b: 2,
                c: 3,
                d: 4
            }
        });
    });
});
