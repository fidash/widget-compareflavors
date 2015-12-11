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

function remove(targetId, list) {
    const targetIndex = getIndexById(targetId, list);
    return [...list.slice(0, targetIndex), ...list.slice(targetIndex + 1)]
}

function copy(sourceId, publicList, privateList, newRegion) {
    // Make request here when API is available
    const sourceIndex = getIndexById(sourceId, publicList);
    let newElem =JSON.parse(JSON.stringify(publicList[sourceIndex]));
    newElem.public = false;
    newElem.nodes.push(newRegion);
    return privateList.concat(newElem);
}

function replace(sourceId, targetId, publicList, privateList, newRegion) {
    const newList = remove(targetId, privateList);
    return copy(sourceId, publicList, newList, newRegion);
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
    case DELETE_FLAVOR:
        return {
          publicflavors,
          privateflavors: remove(action.flavorId, state.privateflavors)
        };
    case REPLACE_FLAVOR:
        return {
            publicflavors,
            privateflavors: replace(action.sourceId, action.targetId, state.publicflavors, state.privateflavors, action.region)
        };
    case COPY_FLAVOR:
        return {
            publicflavors,
            privateflavors: copy(action.flavorId, state.publicflavors, state.privateflavors, action.region)
        };
    default:
        return state;
    }
}
