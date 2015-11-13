"use strict";

import hider from "../../js/reducers/hider";
import select from "../../js/reducers/select";
import flavors from "../../js/reducers/flavors";
import rootReducer from "../../js/reducers/index";
import {toggleVisibility, setLeft, setRight, setRegion, clearLR, setFlavors, movePublic, movePrivate} from "../../js/actions";
import nactions from "./nactions";

describe("hider reducer", () => {
    it("initial state is false", () => {
        expect(nactions(hider)).toBeFalsy();
    });

    it("no change in unknown action", () => {
        expect(nactions(hider, ["NOEXIST"])).toEqual(nactions(hider));
    });

    it("one toggle to true", () => {
        expect(nactions(hider, [toggleVisibility()])).toBeTruthy();
    });

    it("n toggles works", () => {
        expect(nactions(hider, [toggleVisibility(), toggleVisibility()])).toBeFalsy();
        expect(nactions(hider, [toggleVisibility(), toggleVisibility(), toggleVisibility()])).toBeTruthy();
    });
});

describe("select reducer", () => {
    it("initial state is correct", () => {
        expect(nactions(select)).toEqual({
            left: "",
            right: "",
            region: ""
        });
    });

    it("no change in unknown action", () => {
        expect(nactions(select, ["NOEXIST"])).toEqual(nactions(select));
    });

    it("choose_left", () => {
        const left = "choosen";

        expect(nactions(select, [setLeft(left)])).toEqual({
            left,
            right: "",
            region: ""
        });
    });

    it("choose_right", () => {
        const right = "choosen";

        expect(nactions(select, [setRight(right)])).toEqual({
            right,
            left: "",
            region: ""
        });
    });

    it("choose both", () => {
        const left = "left value", right = "right value!";

        expect(nactions(select, [setRight(right), setLeft(left)])).toEqual({
            left,
            right,
            region: ""
        });

        expect(nactions(select, [setLeft(left), setRight(right)])).toEqual({
            left,
            right,
            region: ""
        });
    });

    it("clearLR", () => {
        const left = "LV", right = "RV", empty = {left: "", right: "", region: ""};

        expect(nactions(select, [setLeft(left), clearLR()])).toEqual(empty);
        expect(nactions(select, [setRight(right), clearLR()])).toEqual(empty);
        expect(nactions(select, [setLeft(left), setRight(right), clearLR()])).toEqual(empty);
    });
});

describe("flavors reducer", () => {
    it("Initial state is correct", () => {
        expect(nactions(flavors)).toEqual({
            privateflavors: [],
            publicflavors: []
        });
    });

    it("No change in unknown action", () => {
        expect(nactions(flavors, ["NOEXIST"])).toEqual(nactions(flavors));
    });

    it("Set flavors", () => {
        const publicflavors = [1, 2], privateflavors = [3, 4];

        expect(nactions(flavors, [setFlavors(publicflavors, privateflavors)])).toEqual({
            publicflavors,
            privateflavors
        });
    });

    it("movePrivate", () => {
        const publicflavors = [9, 7, 1, 1], privateflavors = [1, 2, 3, 4];

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePrivate(2, 1)
        ])).toEqual({
            publicflavors,
            privateflavors: [1, 3, 2, 4]
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePrivate(0, 3)
        ])).toEqual({
            publicflavors,
            privateflavors: [2, 3, 4, 1]
        });
    });

    it("movePublic", () => {
        const privateflavors = [9, 7, 1, 1], publicflavors = [1, 2, 3, 4];

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePublic(1, 2)
        ])).toEqual({
            publicflavors: [1, 3, 2, 4],
            privateflavors
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePublic(3, 0)
        ])).toEqual({
            publicflavors: [4, 1, 2, 3],
            privateflavors
        });
    });

    it("move private out of range", () => {
        const publicflavors = [9, 7, 1, 1], privateflavors = [1, 2, 3, 4];

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePrivate(-1, 2)
        ])).toEqual({
            publicflavors,
            privateflavors
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePrivate(0, 4)
        ])).toEqual({
            publicflavors,
            privateflavors
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePrivate(-10000, 10000)
        ])).toEqual({
            publicflavors,
            privateflavors
        });
    });

    it("move public out of range", () => {
        const publicflavors = [9, 7, 1, 1], privateflavors = [1, 2, 3, 4];

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePublic(-1, 2)
        ])).toEqual({
            publicflavors,
            privateflavors
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePublic(0, 4)
        ])).toEqual({
            publicflavors,
            privateflavors
        });

        expect(nactions(flavors, [
            setFlavors(publicflavors, privateflavors),
            movePublic(-10000, 10000)
        ])).toEqual({
            publicflavors,
            privateflavors
        });
    });
});


describe("root reducer", () => {
    const filter = false, flavorsdef = {publicflavors: [], privateflavors: []}, selectdef = {left: "", right: "", region: ""};

    it("default value is correct", () => {
        expect(nactions(rootReducer)).toEqual({
            filter,
            flavors: flavorsdef,
            select: selectdef
        });
    });

    it("No change in unknown action", () => {
        expect(nactions(rootReducer, ["NOEXIST"])).toEqual(nactions(rootReducer));
    });

    it("filter", () => {
        expect(nactions(rootReducer, [toggleVisibility(), toggleVisibility(), toggleVisibility()])).toEqual({
            flavors: flavorsdef,
            select: selectdef,
            filter: true
        });
    });

    it("select", () => {
        const left = "LEFTV", right = "RIGHTV";

        expect(nactions(rootReducer, [setLeft(left), setRight(right)])).toEqual({
            filter,
            flavors: flavorsdef,
            select: {
                left,
                right,
                region: ""
            }
        });
    });

    it("flavors", () => {
        const publicflavors = [1, 2], privateflavors = [3, 4];

        expect(nactions(rootReducer, [setFlavors(publicflavors, privateflavors)])).toEqual({
            filter,
            select: selectdef,
            flavors: {
                publicflavors,
                privateflavors
            }
        });
    });

    it("set region", () => {
        const left = "", right = "", region = "myregion";

        expect(nactions(rootReducer, [setRegion(region)])).toEqual({
            filter,
            flavors: flavorsdef,
            select: {
                left,
                right,
                region: region
            }
        });
    });


    it("All", () => {
        const left = "LEFTV", right = "RIGHTV";
        const publicflavors = [1, 2], privateflavors = [3, 4];

        expect(nactions(rootReducer, [
            toggleVisibility(),
            setRight(right),
            setFlavors(publicflavors, privateflavors),
            toggleVisibility(),
            setLeft(left),
            toggleVisibility()
        ])).toEqual({
            filter: true,
            select: {
                left,
                right,
                region: ""
            },
            flavors: {
                publicflavors,
                privateflavors
            }
        });
    });

});
