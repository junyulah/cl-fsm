'use strict';

let count = 0;
let autoGenerateGraphStateName = () => {
    return `__auto_state_name_${count++}`;
};

module.exports = {
    autoGenerateGraphStateName
};
