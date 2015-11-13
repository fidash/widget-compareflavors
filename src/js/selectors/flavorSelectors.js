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
    flavorsSelector,
    filterSelector,
    selectSelector,
    (flavors, filter, select) => {
        const {publicflavors: originalpublic, privateflavors: originalprivate} = flavors;
        const {region} = select;
        const regions = new Set(originalprivate.map(x => x.nodes).reduce((acc, x) => [...acc, ...x], []));
        const inRegion = (flavor, r) => new Set(flavor.nodes).has(r);
        const defaultregion = (regions.size === 0) ? "" : [...regions][0];
        const regionselected = (regions.has(region) ? region : defaultregion);
        const newprivateflavors = originalprivate.filter(f => inRegion(f, regionselected));

        const {publicflavors, privateflavors} = selectPublicPrivate({
            publicflavors: originalpublic,
            privateflavors: newprivateflavors
        }, filter);
        // const {filter, publicflavors} = publicprivate;
        // const oldprivateflavors = publicprivate.privateflavors;

        const {left, right} = selectLeftRight(select, publicflavors, privateflavors);
        const {equalleft, equalright} = otherEqual({left, right}, {publicflavors, privateflavors});

        return {
            equalleft,
            equalright,
            filter,
            left,
            privateflavors,
            publicflavors,
            region: regionselected,
            regions: [...regions],
            right
        };
    }
);
