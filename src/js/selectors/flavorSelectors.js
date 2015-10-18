"use strict";

/*
  Let's use selectors to avoid recalculate everything if the data is not equal
*/

import {createSelector} from "reselect";

function flavorsEqual(f1, f2) {
    return (f1.disk === f2.disk &&
            f1.ram === f2.ram &&
            f1.vcpus === f2.vcpus);
}

function notInPriv(flav, priv) {
    const privsfilt = priv.filter(f => flavorsEqual(flav, f));

    return privsfilt.length === 0;
}

const findOrEmpty = (def, list) =>
      (typeof list.find(x => x.id === def) !== "undefined") ? def : "";

function selectPublicPrivate(flavors, filter) {
    const privateflavors = flavors.filter(f => !f.public);
    const publicflavors = flavors.filter(
        f => f.public && (!filter || notInPriv(f, privateflavors))
    );

    return {publicflavors, privateflavors};
}

function selectLeftRight(select, publicflavors, privateflavors) {
    const left = findOrEmpty(select.left, publicflavors);
    const right = findOrEmpty(select.right, privateflavors);

    return {left, right};
}

const flavorsSelector = state => state.flavors;
const filterSelector = state => state.filter;
const selectSelector = state => state.select;

const publicPrivateSelector = createSelector(
    flavorsSelector,
    filterSelector,
    (flavors, filter) => {
        const {publicflavors, privateflavors} = selectPublicPrivate(flavors, filter);

        return {filter, publicflavors, privateflavors};
    }
);

export const flavorSelectors = createSelector(
    publicPrivateSelector,
    selectSelector,
    ({filter, publicflavors, privateflavors}, select) => {
        const {left, right} = selectLeftRight(select, publicflavors, privateflavors);

        return {
            filter,
            publicflavors,
            privateflavors,
            left,
            right
        };
    }
);
