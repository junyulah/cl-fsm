'use strict';

/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=FSM
 *
 *
 * let {
 *     stateGraphDSL, fsm, WAIT, MATCH
 * } = FSM;
 *
 * let {
 *     g, c, union, range, sequence, circle, left, repeat
 * } = stateGraphDSL;
 *
 * let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));
 *
 * let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');
 *
 * let stringDFA = g(
 *     c('"', g('enter',
 *         c('\\', g(
 *             c(escapeSymbols, 'enter'),
 *             c('u',
 *                 g(repeat(hexDigit, 4, 'enter'))
 *             ))),
 *         c('"', 'accept'),
 *         c(left(), 'enter')
 *     )));
 *
 * let m = fsm(stringDFA);
 * console.log(m('"').type === WAIT);
 * console.log(m('a').type === WAIT);
 * console.log(m('b').type === WAIT);
 * console.log(m('"').type === MATCH);
 *
 **/
module.exports = require('./src');
