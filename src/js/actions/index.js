"use strict";

import * as types from "../constants/ActionTypes";

export function toggleVisibility() {
    return {type: types.TOGGLE_VISIBILITY};
}

export function setFlavors(publicflavors, privateflavors) {
    return {type: types.SET_FLAVORS, publicflavors, privateflavors};
}

export function movePublic(from, to) {
    return {type: types.MOVE_PUBLIC, from, to};
}

export function movePrivate(from, to) {
    return {type: types.MOVE_PRIVATE, from, to};
}

export function setLeft(left) {
    return {type: types.SET_CHOOSE_LEFT, left};
}

export function setRight(right) {
    return {type: types.SET_CHOOSE_RIGHT, right};
}

export function setRegion(region) {
    return {type: types.SET_REGION, region};
}

export function clearLR() {
    return {type: types.CLEAR_LR};
}

export function setRegions(regions) {
    return {type: types.SET_REGIONS, regions};
}
