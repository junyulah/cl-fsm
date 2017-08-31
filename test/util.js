'use strict';

let assert = require('assert');
let {
    fsm
} = require('..');

module.exports = {
    runCaseData: (caseData) => {
        for (let name in caseData) {
            let [graphData, seqs] = caseData[name];

            it(name, () => {
                let m = fsm(graphData);
                for (let i = 0; i < seqs.length; i++) {
                    let {
                        letter, type, state
                    } = seqs[i];
                    if (type !== undefined) {
                        assert.equal(m(letter).type, type);
                    }

                    if (state !== undefined) {
                        assert.equal(m(letter).state, state);
                    }
                }
            });
        }
    }
};
