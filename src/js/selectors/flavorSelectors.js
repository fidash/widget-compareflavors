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

function getEqualsList(privateFlavors, publicFlavors) {
    let equalsList = [];
    if (privateFlavors && publicFlavors) {
        publicFlavors.forEach(flavor => {
            if(privateFlavors.filter(p => flavorsEqual(flavor, p)).length !== 0) {
                equalsList.push(flavor);
            }
        });
    }

    return equalsList;
}

function inEqualsList(flavor, equalsList) {
    return equalsList.filter(f => flavorsEqual(f, flavor)).length !== 0;
}

function selectFlavors({privateflavors: allprivateflavors, publicflavors: allpublicflavors}, filter, equalsList) {
    const publicflavors = allpublicflavors ? allpublicflavors.filter(
        f => f.public && (!filter || !inEqualsList(f, equalsList))
    ) : [];

    const privateflavors = allprivateflavors ? allprivateflavors.filter(
        f => !f.public && (!filter || !inEqualsList(f, equalsList))
    ) : [];

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
const regionsSelector = state => state.regions;

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

function checkRegions(flavorList) {
    let isCorrect = true;
    for (let i = 0; i<flavorList.length && isCorrect === true; i++) {
        if (!flavorList[i].nodes || flavorList[i].nodes.length === 0) {
            isCorrect = false;
        }
    }

    return isCorrect;
}

export const flavorSelectors = createSelector(
    flavorsSelector,
    filterSelector,
    selectSelector,
    regionsSelector,
    (flavors, filter, select, regions) => {
        const {publicflavors: originalpublic, privateflavors: originalprivate} = flavors;
        const {region} = select;
        const regionsList = regions.regions;
        const inRegion = (flavor, r) => new Set(flavor.nodes).has(r);
        const defaultregion = (regionsList.size === 0) ? "" : [...regionsList][0];
        const regionselected = (regionsList.indexOf(region) !== -1 ? region : defaultregion);
        const newprivateflavors = originalprivate.filter(f => inRegion(f, regionselected));
        const equalsList = getEqualsList(newprivateflavors, originalpublic);

        const {publicflavors, privateflavors} = selectFlavors({
            publicflavors: originalpublic,
            privateflavors: newprivateflavors
        }, filter, equalsList);
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
            regions: [...regionsList],
            right
        };
    }
);
