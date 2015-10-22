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

const findOrEmpty = (def, list) =>
      (typeof list.find(x => x.id === def) !== "undefined") ? def : "";

function notInPriv(flav, priv) {
    const privsfilt = priv.filter(f => flavorsEqual(flav, f));

    return privsfilt.length === 0;
}

function selectPublicPrivate({privateflavors, publicflavors: allpublicflavors}, filter) {
    const publicflavors = allpublicflavors.filter(
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

function otherEqual({left, right}, {publicflavors, privateflavors}) {
    if ((left === "" && right === "") || (left !== "" && right !== "")) {
        return {
            equalleft: [],
            equalright: []
        };
    }
    const filterEqualMap = (list, elem) => list.
              filter(x => flavorsEqual(x, elem)).
              map(x => x.id);

    const isleft = left !== "";
    const compid = (isleft) ? left : right;
    const complist = (isleft) ? publicflavors : privateflavors;
    const component = complist.find(x => x.id === compid);

    const equalleft = (isleft) ? [] : filterEqualMap(publicflavors, component);
    const equalright = (isleft) ? filterEqualMap(privateflavors, component) : [];

    return {
        equalleft,
        equalright
    };
}

export const flavorSelectors = createSelector(
    publicPrivateSelector,
    selectSelector,
    ({filter, publicflavors, privateflavors}, select) => {
        const {left, right} = selectLeftRight(select, publicflavors, privateflavors);
        const {equalleft, equalright} = otherEqual({left, right}, {publicflavors, privateflavors});

        return {
            filter,
            publicflavors,
            privateflavors,
            left,
            right,
            equalleft,
            equalright
        };
    }
);
