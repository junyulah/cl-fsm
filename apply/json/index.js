'use strict';

let {
    stateGraphDSL
} = require('../..');

let {
    g, c, union, range, sequence, circle, left, repeat
} = stateGraphDSL;

let numberDFA = g(c(union(null, '-'),
    g(
        c('0', g('decimal',
            c('.', circle(range('0', '9'), 'science')),
            c(null, g('science',
                c(null, 'accept'),
                sequence(
                    union('e', 'E'),
                    union('+', '-', null),
                    range('0', '9'),
                    circle(range('0', '9'), 'accept')
                )
            ))
        )),

        sequence(
            range('1', '9'),
            circle(range('0', '9'), 'decimal')
        )
    )
));

let hexDigit = union(range('0', '9'), range('A', 'F'), range('a', 'f'));

let escapeSymbols = union('"', '\\', '\/', 'b', 'f', 'n', 'r', 't');

let stringDFA = g(
    c('"', g('enter',
        c('\\', g(
            c(escapeSymbols, 'enter'),
            c('u',
                g(repeat(hexDigit, 4, 'enter'))
            ))),
        c('"', 'accept'),
        c(left(), 'enter')
    )));

module.exports = {
    numberDFA,
    stringDFA
};
