'use strict';

let {
    fsm,
    QUIT, WAIT, MATCH
} = require('..');

let {
    numberGraph, stringGraph
} = require('../apply/json');

let assert = require('assert');

describe('json', () => {
    it('number', () => {
        assert.equal(fsm(numberGraph)('0').type, MATCH);
        assert.equal(fsm(numberGraph)('1').type, MATCH);
    });

    it('number:2', () => {
        let m = fsm(numberGraph);

        assert.equal(m('-').type, WAIT);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('2').type, MATCH);
        assert.equal(m('-').type, QUIT);
    });

    it('number:3', () => {
        let m = fsm(numberGraph);

        assert.equal(m('9').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('2').type, MATCH);
    });

    it('number:4', () => {
        let m = fsm(numberGraph);

        assert.equal(m('1').type, MATCH);
        assert.equal(m('.').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('e').type, WAIT);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('0').type, MATCH);
    });

    it('number:letter', () => {
        let m = fsm(numberGraph);

        assert.equal(m('a').type, QUIT);
    });

    it('string:empty string', () => {
        let m = fsm(stringGraph);
        assert.equal(m('"').type, WAIT);
        assert.equal(m('"').type, MATCH);
    });

    it('string:normal string', () => {
        let m = fsm(stringGraph);
        assert.equal(m('"').type, WAIT);
        assert.equal(m('a').type, WAIT);
        assert.equal(m('b').type, WAIT);
        assert.equal(m('"').type, MATCH);
    });

    it('string:escape', () => {
        ['"', '\\', '/', 'b', 'f', 'n', 'r', 't'].map((item) => {
            let m = fsm(stringGraph);
            assert.equal(m('"').type, WAIT);
            assert.equal(m('\\').type, WAIT);
            assert.equal(m(item).type, WAIT);
            assert.equal(m('"').type, MATCH);
        });
    });

    it('string:unicode', () => {
        let m = fsm(stringGraph);
        assert.equal(m('"').type, WAIT);
        assert.equal(m('\\').type, WAIT);
        assert.equal(m('u').type, WAIT);
        assert.equal(m('1').type, WAIT);
        assert.equal(m('3').type, WAIT);
        assert.equal(m('2').type, WAIT);
        assert.equal(m('3').type, WAIT);
        assert.equal(m('"').type, MATCH);
    });
});
