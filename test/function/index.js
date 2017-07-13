'use strict';

let {
    runCaseData
} = require('../util');

let caseData = require('../fixture/caseData/base');

describe('fsm', () => {
    runCaseData(caseData);
});
