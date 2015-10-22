"use strict";

import {SET_FLAVORS, MOVE_PUBLIC, MOVE_PRIVATE} from "../constants/ActionTypes";

const initialState = {
    privateflavors: [],
    publicflavors: []
};

function move(from, to, list) {
    const elem = list[from];

    return (typeof elem === "undefined") ? list :
        [...list.slice(0, to),
         elem,
         ...list.slice(to)];
}

export default function flavors(state = initialState, action) {
    const {privateflavors, publicflavors} = state;

    switch (action.type) {
    case SET_FLAVORS: // Reset Left&Right
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
