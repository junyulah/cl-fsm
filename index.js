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
module.exports = require('./lib');
