"use strict";

import {flavorSelectors} from "../../js/selectors/flavorSelectors";
import {toggleVisibility, setFlavors, setLeft, setRight, setRegion, setRegions} from "../../js/actions/index";
import configureStore from "../../js/stores/configureStore";

describe("Selectors", () => {
    const REFERENCE_REGION = "Spain2";
    let store;
    const expecstate = (state, filter, publicflavors, privateflavors, left, right, equalleft, equalright, region, regions) => { // eslint-disable-line max-params
        expect(state).toEqual({
            equalleft,
            equalright,
            filter,
            privateflavors,
            publicflavors,
            region,
            regions,
            left,
            right
        });
    };

    beforeEach(() => {
        store = configureStore();
    });

    it("initial state is correct", () => {
        const state = flavorSelectors(store.getState());

        expecstate(state, false, [], [], "", "", [], [], undefined, []);
    });

    it("filter public", () => {
        const publicflavors = [{
            public: true,
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }];

        store.dispatch(setRegions(["region"]));
        store.dispatch(toggleVisibility());
        store.dispatch(setFlavors(publicflavors, privateflavors));

        const state = flavorSelectors(store.getState());

        expecstate(state, true, [{public: true, disk: 4, ram: 5, vcpus: 8, nodes: ["Spain2"]}], [], "", "", [], [], "region", ["region"]);
    });

    it("select with non exist id return empty", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }];

        store.dispatch(setRegions(["region"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("9711"));
        store.dispatch(setRight("9711"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "", "", [], [], "region", ["region"]);
    });

    it("select with exist left id", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }];

        store.dispatch(setRegions(["region"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("123"));
        store.dispatch(setRight("9711"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "123", "", [], ["285"], "region", ["region"]);
    });

    it("select with exist right id", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }];

        store.dispatch(setRegions(["region"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("9711"));
        store.dispatch(setRight("285"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "", "285", ["123"], [], "region", ["region"]);
    });

    it("when both selected, no equal returns", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }, {
            public: false,
            id: "543",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: ["region"]
        }];

        store.dispatch(setRegions(["region"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("345"));
        store.dispatch(setRight("285"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "345", "285", [], [], "region", ["region"]);
    });

    it("filter private flavors by region", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }, {
            public: false,
            id: "543",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: ["region", "alone"]
        }];

        store.dispatch(setRegions(["region", "alone"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setRegion("alone"));

        let state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, [privateflavors[1]], "", "", [], [], "alone", ["region", "alone"]);

        store.dispatch(setRegion("region"));

        state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "", "", [], [], "region", ["region", "alone"]);
    });

    it("filter and region", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: [REFERENCE_REGION]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: [REFERENCE_REGION]
        }];
        const privateflavors = [{
            public: false,
            id: "1234",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["shared", "region2"]
        }, {
            public: false,
            id: "285",
            disk: 3,
            ram: 123,
            vcpus: 1,
            nodes: ["shared", "region1"]
        }];

        store.dispatch(setRegions(["shared", "region2", "region1"]));
        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(toggleVisibility());

        let state = flavorSelectors(store.getState());

        expecstate(state, true, [publicflavors[1]], [privateflavors[1]], "", "", [], [], "shared", ["shared", "region2", "region1"]);

        store.dispatch(setRegion("region1"));
        state = flavorSelectors(store.getState());

        expecstate(state, true, publicflavors, [privateflavors[1]], "", "", [], [], "region1", ["shared", "region2", "region1"]);

    });

});
