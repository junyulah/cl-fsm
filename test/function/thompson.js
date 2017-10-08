'use strict';

let ThompsonConstruction = require('../../lib/thompsonConstruction');
let assert = require('assert');

describe('index', () => {
    it('base', () => {
        let tc = new ThompsonConstruction();

        let tnfa = tc.concatExpression(
            tc.symbol('a'), tc.unionExpression(tc.symbol('b'), tc.symbol('c')));
        assert.deepEqual(tnfa.nfa.toDFA(tnfa.start).dfa.transitionGraph, {
            '0': {
                a: 1
            },
            '1': {
                b: 2,
                c: 3
            }
        });
    });

    it('star', () => {
        let tc = new ThompsonConstruction();
        let tnfa2 = tc.star(tc.concatExpression(tc.symbol('a'), tc.symbol('b')));
        assert.deepEqual(tnfa2.nfa.toDFA(tnfa2.start).dfa.transitionGraph, {
            '0': {
                a: 1
            },
            '1': {
                b: 2
            },
            '2': {
                a: 1
            }
        });
    });
});
