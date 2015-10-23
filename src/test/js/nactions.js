"use strict";

const nactions = (reducer, names = []) => {
    let result = reducer(undefined, "init@@redux/INIT"),
        name;

    for (name of names) {
        result = reducer(result, name);
    }
    return result;
};

export default nactions;
