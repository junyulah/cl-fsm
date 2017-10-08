'use strict';

let {
    RegularExp
} = require('../../lib');

let assert = require('assert');

describe('index', () => {
    it('base', () => {
        let reg = new RegularExp('abc|[def]gh');
        let state = reg.getStartState();
        state = reg.transit(state, 'e');
        assert(!reg.isEndState(state));
        assert(!reg.isErrorState(state));

        state = reg.transit(state, 'g');
        assert(!reg.isEndState(state));
        assert(!reg.isErrorState(state));

        state = reg.transit(state, 'h');
        assert(reg.isEndState(state));

        state = reg.transit(state, 'r');
        assert(reg.isErrorState(state));
    });
});
