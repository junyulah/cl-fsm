'use strict';

let actionDSL = require('./actionDSL');

let {
    isNormalAction, isRangeAction, isUnionAction, isLeftAction, isEpsilonAction
} = actionDSL;

let {
    graph,
    connect,

    repeat,
    sequence,

    circle,

    isEpsilonTransition
} = require('./graphDSL');

let {
    mergeMap
} = require('bolzano');

let transitionMaper = (graph) => {
    let transitions = {};
    let {
        transitionMap
    } = graph;

    let accepts = getEndStates(graph);

    let leftMap = getLeftActionMap(transitionMap);
    let epsilonMap = getEpsilonActionMap(transitionMap);

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];

        transitions[stateName] = (letter) => {
            for (let i = transitList.length - 1; i >= 0; i--) {
                let {
                    state, action
                } = transitList[i];

                if (matchAction(action, letter)) return state;
            }

            // check rest
            if (leftMap[stateName]) return leftMap[stateName];

            if (epsilonMap[stateName]) {
                return {
                    type: 'deliver',
                    state: epsilonMap[stateName]
                };
            }
        };
    }

    return {
        transitions,
        acceptStateMap: getAcceptStateMap(epsilonMap, accepts)
    };
};

/**
 * a end state's out-degree = 0
 */
let getEndStates = (graph) => {
    let outDegreeMap = getOutDegreeMap(graph);
    let ends = [];
    for (let name in outDegreeMap) {
        if (outDegreeMap[name] === 0) {
            ends.push(name);
        }
    }

    return ends;
};

let getOutDegreeMap = (graph) => {
    let outDegreeMap = {};
    let {
        transitionMap
    } = graph;
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        outDegreeMap[stateName] = transitList.length;
        for (let i = 0; i < transitList.length; i++) {
            let {
                state
            } = transitList[i];
            outDegreeMap[state] = outDegreeMap[state] || 0;
        }
    }

    return outDegreeMap;
};

/**
 * epsilon chain
 */
let getAcceptStateMap = (epsilonMap, accepts) => {
    let acceptStateMap = {};

    let reverseEpsilonMap = {};
    for (let name in epsilonMap) {
        let tar = epsilonMap[name];
        reverseEpsilonMap[tar] = reverseEpsilonMap[tar] || [];
        reverseEpsilonMap[tar].push(name);
    }

    for (let i = 0; i < accepts.length; i++) {
        let accept = accepts[i];
        acceptStateMap[accept] = true;
    }

    let count = 0;

    while (true) { // eslint-disable-line
        let prevCount = count;

        for (let name in acceptStateMap) {
            let list = reverseEpsilonMap[name];
            if (list) {
                for (let j = 0; j < list.length; j++) {
                    if (!acceptStateMap[list[j]]) {
                        acceptStateMap[list[j]] = true;
                        count++;
                    }
                }
            }
        }

        if (count === prevCount) { // no more
            break;
        }
    }

    return acceptStateMap;
};

let matchAction = (action, letter) => {
    if (isNormalAction(action) && action.content === letter) return true;
    if (isRangeAction(action) && action.start <= letter && letter <= action.end) return true;
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (matchAction(actions[i], letter)) return true;
        }
    }

    return false;
};

let getEpsilonActionMap = (transitionMap) => {
    let map = {};

    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isEpsilonAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }

    return map;
};

let getLeftActionMap = (transitionMap) => {
    let map = {};
    for (let stateName in transitionMap) {
        let transitList = transitionMap[stateName];
        let tarState = findActionState(transitList, isLeftAction);
        if (tarState) {
            map[stateName] = tarState;
        }
    }
    return map;
};

let findActionState = (transitList, type) => {
    for (let i = transitList.length - 1; i >= 0; i--) {
        let {
            action, state
        } = transitList[i];
        if (containActionType(action, type)) {
            return state;
        }
    }
};

let containActionType = (action, type) => {
    if (isUnionAction(action)) {
        let {
            actions
        } = action;

        for (let i = 0; i < actions.length; i++) {
            if (containActionType(actions[i], type)) return true;
        }
    } else {
        return type(action);
    }

    return false;
};

module.exports = mergeMap(actionDSL, {
    graph,
    connect,

    transitionMaper,
    repeat,
    sequence,

    circle,

    isEpsilonTransition,

    g: graph, c: connect
});
