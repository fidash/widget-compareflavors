"use strict";

import React from "react";
import TestUtils from "react-addons-test-utils";
import configureStore from "../../js/stores/configureStore";
import {setFlavors, setLeft, setRight} from "../../js/actions";
import App from "../../js/containers/App";

const MockMP = window.MockMP;

function setup(store) {
    const instance = TestUtils.renderIntoDocument(<App store={store} />);

    return {
        instance,
        app: instance.refs.wrappedInstance
    };
    // const renderer = TestUtils.createRenderer();

    // renderer.render(<App store={store} />);
    // const instance = renderer.getRenderOutput();

    // return {
    //     instance
    // };
}

describe("App container", () => {
    let store;
    const expectstate = (filter, publicflavors, privateflavors, left, right, region) => { // eslint-disable-line max-params
        expect(store.getState()).toEqual({
            filter,
            flavors: {
                publicflavors,
                privateflavors
            },
            select: {
                left,
                right,
                region
            }
        });
    };
    const initialvalue = () => {
        expectstate(false, [], [], "", "", "");
    };

    beforeAll(() => {
        store = configureStore();
        window.MashupPlatform = new MockMP.MockMP();
    });

    it("MashupPlatform http is called", () => {
        const spy = jasmine.createSpy("makeRequest");

        window.MashupPlatform.http = {
            makeRequest: spy
        };

        setup(store);

        expect(spy).toHaveBeenCalled();
    });

    it("On http error, lists are cleared", done => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8,
            nodes: ["region"]
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1,
            nodes: ["region"]
        }];

        store.dispatch(setFlavors(publicflavors, privateflavors));
        window.MashupPlatform.http = {
            makeRequest: (url, options) => {
                setTimeout(() => options.onFailure("FAIL"), 0);
            }
        };

        setup(store);

        setTimeout(() => {
            initialvalue();
            done();
        }, 0);

    });

    it("set state with data from http request", done => {
        const publicflavors = [{
            disk: 2,
            public: true,
            name: "TEST",
            id: "noid",
            ram: 512,
            vcpus: 2,
            nodes: ["region"]
        }];
        const privateflavors = [{
            disk: 1,
            public: false,
            name: "TESTE",
            id: "idr",
            ram: 1024,
            vcpus: 8,
            nodes: ["region"]
        }];
        const responsedata = {
            flavors: [...publicflavors, ...privateflavors]
        };

        window.MashupPlatform.http = {
            makeRequest: (url, options) => {
                setTimeout(() => options.onSuccess({
                    response: JSON.stringify(responsedata)
                }), 0);
            }
        };

        const {app} = setup(store);

        setTimeout(() => {
            const lis = TestUtils.scryRenderedDOMComponentsWithTag(app, "li");

            expect(lis.length).toEqual(2);
            expectstate(false, publicflavors, privateflavors, "", "", "");
            done();
        }, 0);
    });

    it("test", done => {
        const publicflavors = [{
            disk: 2,
            public: true,
            name: "TEST",
            id: "noid",
            ram: 512,
            vcpus: 2,
            nodes: ["region"]
        }];
        const privateflavors = [{
            disk: 1,
            public: false,
            name: "TESTE",
            id: "idr",
            ram: 1024,
            vcpus: 8,
            nodes: ["region"]
        }];
        const responsedata = {
            flavors: [...publicflavors, ...privateflavors]
        };

        window.MashupPlatform.http = {
            makeRequest: (url, options) => {
                setTimeout(() => options.onSuccess({
                    response: JSON.stringify(responsedata)
                }), 0);
            }
        };

        const {app, instance} = setup(store);

        setTimeout(() => {
            expectstate(false, publicflavors, privateflavors, "", "", "");

            const leftc = app.handleFlavorClick(setLeft, {
                old: "",
                myname: "left",
                othername: "right",
                mylist: publicflavors,
                otherlist: privateflavors
            }).bind(instance);
            const rightc = app.handleFlavorClick(setRight, {
                old: "",
                myname: "right",
                othername: "left",
                mylist: privateflavors,
                otherlist: publicflavors
            }).bind(instance);

            leftc("noid");
            rightc("idr");

            expectstate(false, publicflavors, privateflavors, "noid", "idr", "");

            expect(window.MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("compare", JSON.stringify({
                to: {
                    vcpus: 2,
                    ram: 512,
                    disk: 2,
                    name: "TEST"
                },
                from: {
                    vcpus: 8,
                    ram: 1024,
                    disk: 1,
                    name: "TESTE"
                }
            }));

            done();
        }, 0);
    });
});
