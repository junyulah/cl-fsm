'use strict';

let {
    stateGraphDSL,
    QUIT, WAIT, MATCH
} = require('../../..');

let {
    g, c, repeat, union, left, range, sequence, circle
} = stateGraphDSL;

module.exports = {
    'base': [g(c('a')), [{
        letter: 'a',
        type: MATCH
    }, {
        letter: 'b',
        type: QUIT
    }]],

    'two': [g(
        c('a', g(
            c('b')
        ))), [{
        letter: 'a',
        type: WAIT
    }, {
        letter: 'b',
        type: MATCH
    }]],

    'left': [g(
        c('a', 'state1'),
        c(left(), 'state2')
    ), [{
        letter: 'a',
        state: 'state1'
    }]],

    'left2': [g(
        c('a', 'state1'),
        c(left(), 'state2')
    ), [{
        letter: 'b',
        state: 'state2'
    }]],

    'range0': [g(
        c(range('1', '9'), 'go')
    ), [{
        letter: '1',
        state: 'go'
    }]],

    'range1': [g(
        c(range('1', '9'), 'go')
    ), [{
        letter: '5',
        state: 'go'
    }]],

    'range2': [g(
        c(range('1', '9'), 'go')
    ), [{
        letter: 'a',
        type: QUIT
    }]],

    'epsilon1': [g(
        c(null, g(
            c('b')
        )),
        c('a', 'go')
    ), [{
        letter: 'a',
        type: MATCH,
        state: 'go'
    }]],

    'epsilon2': [g(
        c(null, g(
            c('b', 'accept')
        )),
        c('a', 'go')
    ), [{
        letter: 'b',
        type: MATCH,
        state: 'accept'
    }]],

    'epsilon3': [g(
        c(null, g(
            c('b')
        )),
        c('a', 'go')
    ), [{
        letter: 'c',
        type: QUIT
    }]],

    'union0': [g(
        c(union('a', 'b'), 'accept')
    ), [{
        letter: 'a',
        type: MATCH,
        state: 'accept'
    }]],

    'union1': [g(
        c(union('a', 'b'), 'accept')
    ), [{
        letter: 'b',
        type: MATCH,
        state: 'accept'
    }]],

    'union2': [g(
        c(union('a', 'b'))
    ), [{
        letter: 'c',
        type: QUIT
    }]],

    'repeat': [g(
        repeat('a', 3)
    ), [{
        letter: 'a',
        type: WAIT
    }, {
        letter: 'a',
        type: WAIT
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: QUIT
    }]],

    'repeat:2': [g(
        repeat('a', 3, 'accept')
    ), [{
        letter: 'a',
        type: WAIT
    }, {
        letter: 'a',
        type: WAIT
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: QUIT
    }]],

    'sequence': [g(
        sequence('a', 'b', 'c', 'accept')
    ), [{
        letter: 'a',
        type: WAIT
    }, {
        letter: 'b',
        type: WAIT
    }, {
        letter: 'c',
        type: MATCH
    }, {
        letter: 'd',
        type: QUIT
    }]],

    'circle': [circle('a'), [{
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }, {
        letter: 'a',
        type: MATCH
    }]]
};
