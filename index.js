'use strict';

/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 * let {RegularExp} = FSM;
 *
 * let reg = new RegularExp('[ab]c*');
 *
 * console.log(reg.test('a'));
 * console.log(reg.test('b'));
 * console.log(reg.test('acccccc'));
 * console.log(reg.test('efff'));
 **/

/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 * let {RegularExp} = FSM;
 *
   let reg = new RegularExp('abc|[def]gh');
        let state = reg.getStartState();

        state = reg.transit(state, 'e');
        console.log(reg.isEndState(state));
        console.log(reg.isErrorState(state));

        state = reg.transit(state, 'g');
        console.log(reg.isEndState(state));
        console.log(reg.isErrorState(state));

        state = reg.transit(state, 'h');
        console.log(reg.isEndState(state));

        state = reg.transit(state, 'r');
        console.log(reg.isErrorState(state));
 **/

module.exports = require('./lib');
