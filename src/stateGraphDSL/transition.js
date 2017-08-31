'use strict';

let {
    toAction
} = require('./action');

let {
    graph
} = require('./graph');

let {
    autoGenerateGraphStateName
} = require('./util');

let connect = (action, nextGraph) => {
    action = toAction(action);
    if (!nextGraph) nextGraph = autoGenerateGraphStateName();
    return {
        action,
        nextGraph
    };
};

let repeat = (action, times, nextGraph) => {
    let args = [];
    for (let i = 0; i < times; i++) {
        args.push(action);
    }
    args.push(nextGraph);

    return sequence(...args);
};

let sequence = (...args) => {
    let actions = args.slice(0, -1);
    let nextGraph = args[args.length - 1];
    let action = actions[0];
    if (actions.length <= 1) {
        return connect(action, nextGraph);
    }

    let nexts = actions.slice(1).concat([nextGraph]);

    return connect(action, graph(sequence(...nexts)));
};

/**
 * circle: repeat at least 0 times
 */
let circle = (action, nextGraph) => {
    let stateName = autoGenerateGraphStateName();

    return graph(stateName,
        connect(action, stateName),
        connect(null, nextGraph)
    );
};

module.exports = {
    connect,
    repeat,
    sequence,
    circle
};
