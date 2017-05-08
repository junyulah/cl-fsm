'use strict';

let {
    fsm,
    QUIT, WAIT, MATCH
} = require('..');

let {
    numberDFA
} = require('../apply/json');

let assert = require('assert');

describe('number', () => {
    it('number', () => {
        assert.equal(fsm(numberDFA)('0').type, MATCH);
        assert.equal(fsm(numberDFA)('1').type, MATCH);
    });

    it('number:2', () => {
        let m = fsm(numberDFA);

        assert.equal(m('-').type, WAIT);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('2').type, MATCH);
        assert.equal(m('-').type, QUIT);
    });

    it('number:3', () => {
        let m = fsm(numberDFA);

        assert.equal(m('9').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('2').type, MATCH);
    });

    it('number:4', () => {
        let m = fsm(numberDFA);

        assert.equal(m('1').type, MATCH);
        assert.equal(m('.').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('e').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('0').type, MATCH);
    });

    it('number:letter', () => {
        let m = fsm(numberDFA);

        assert.equal(m('a').type, QUIT);
    });
});
