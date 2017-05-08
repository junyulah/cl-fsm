'use strict';

let {
    stateGraphDSL
} = require('../..');

let {
    g, c, union, range, sequence, circle
} = stateGraphDSL;

let numberDFA = g('my start',
    c(union(null, '-'),
        g(
            c('0', g('decimal',
                c('.', circle(range('0', '9'), 'science')),
                c(null, g('science',
                    c(null, 'accept'),
                    sequence(
                        union('e', 'E'),
                        union('+', '-', null),
                        circle(range('0', '9'), 'accept')
                    )
                ))
            )),

            sequence(
                range('1', '9'),
                circle(range('0', '9'), 'decimal')
            )
        )
    )
);

module.exports = {
    numberDFA
};
