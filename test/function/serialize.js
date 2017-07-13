'use strict';

let {
    fsm,
    WAIT, MATCH
} = require('../..');

let {
    numberGraph
} = require('../../apply/json');

let assert = require('assert');

describe('serialize', () => {
    it('number:4', () => {
        let graphStr = JSON.stringify(numberGraph);
        let numberGraph2 = JSON.parse(graphStr);

        let m = fsm(numberGraph2);

        assert.equal(m('1').type, MATCH);
        assert.equal(m('.').type, MATCH);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('e').type, WAIT);
        assert.equal(m('1').type, MATCH);
        assert.equal(m('0').type, MATCH);
    });
});
