"use strict";

import {SET_FLAVORS, MOVE_PUBLIC, MOVE_PRIVATE, DELETE_FLAVOR, REPLACE_FLAVOR, COPY_FLAVOR} from "../constants/ActionTypes";

const initialState = {
    privateflavors: [],
    publicflavors: []
};

function move(from, to, list) {
    if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
        return list;
    }
    const elem = list[from];
    const newlist = [...list.slice(0, from), ...list.slice(from + 1)];

    return [...newlist.slice(0, to), elem, ...newlist.slice(to)];
}

function getIndexById(id, list) {
    let index = -1;
    for (let i = 0, found = false; i<list.length && !found; i++) {
        if (list[i].id === id) {
            found = true;
            index = i;
        }
    }

    return index;
}

export default function flavors(state = initialState, action) {
    const {privateflavors, publicflavors} = state;

    switch (action.type) {
    case SET_FLAVORS:
        return {
            privateflavors: action.privateflavors,
            publicflavors: action.publicflavors
        };
    case MOVE_PRIVATE:
        return {
            publicflavors,
            privateflavors: move(action.from, action.to, privateflavors)
        };
    case MOVE_PUBLIC:
        return {
            privateflavors,
            publicflavors: move(action.from, action.to, publicflavors)
        };
    default:
        return state;
    }
}
