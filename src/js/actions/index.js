"use strict";

import * as types from "../constants/ActionTypes";

export function toggleVisibility() {
    return {type: types.TOGGLE_VISIBILITY};
}

export function setFlavors(flavors) {
    return {type: types.SET_FLAVORS, flavors};
}

export function setLeft(left) {
    return {type: types.SET_CHOOSE_LEFT, left};
}

export function setRight(right) {
    return {type: types.SET_CHOOSE_RIGHT, right};
}

export function clearLR() {
    return {type: types.CLEAR_LR};
}
