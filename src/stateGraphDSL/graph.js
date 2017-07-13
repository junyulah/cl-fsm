'use strict';

let {
    isString, isObject
} = require('basetype');

/**
 * graph definition DSL
 *
 * state    action
 *
 * transition: (startState, action, nextState)
 */

/**
 * graph(s1,
 *     connect(a1, graph(s2,
 *         connect(a3, s4),
 *         connect(a4, s5)
 *     )),
 *
 *     connect(a2, s3)
 *  )
 */

let {
    autoGenerateGraphStateName
} = require('./util');

/**
 * graph data = {
 *    transitions: [
 *      [action, nextGraph]
 *    ],
 *    state
 * }
 */
let graph = (...args) => {
    let state = null,
        transitions = null;

    if (isString(args[0])) {
        state = args[0]; // first argument could be name
        transitions = args.slice(1);
    } else {
        state = autoGenerateGraphStateName();
        transitions = args;
    }

    let transitionMap = {};

    transitionMap[state] = [];

    for (let i = 0; i < transitions.length; i++) {
        let {
            action, nextGraph
        } = transitions[i];

        let nextState = isString(nextGraph) ? nextGraph : nextGraph.state;

        transitionMap[state].push({
            action,
            state: nextState
        });

        // merge transitionMap
        for (let name in nextGraph.transitionMap) {
            if (transitionMap[name]) {
                throw new Error(`repeated state name for different state, name is ${name}`);
            }
            transitionMap[name] = nextGraph.transitionMap[name];
        }
    }

    return {
        state,
        transitionMap
    };
};

let isEpsilonTransition = (v) => {
    return isObject(v) && v.type === 'deliver';
};

module.exports = {
    graph,
    isEpsilonTransition
};
