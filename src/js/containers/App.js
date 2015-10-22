"use strict";

import React, {Component, PropTypes} from "react";
import Rx from "rx";
import {connect} from "react-redux";
import {Label} from "react-bootstrap";
import FlavorList from "../components/FlavorList";
import Header from "../components/Header";
import {toggleVisibility, setFlavors, setLeft, setRight, clearLR} from "../actions/index";
import {flavorSelectors} from "../selectors/flavorSelectors";

class App extends Component {
    constructor(props) {
        super(props);
        this.MashupPlatform = window.MashupPlatform;
        this.askflavors(this.getpreferences());
        this.MashupPlatform.prefs.registerCallback(() => {
            this.askflavors(this.getpreferences());
        });
    }

    getpreferences() {
        return {
            serverUrl: this.MashupPlatform.prefs.get("serverUrl"),
            user: this.MashupPlatform.prefs.get("user"),
            password: this.MashupPlatform.prefs.get("password")
        };
    }

    buildRequest(preferences, url, method, postBody) {
        let baseURL = preferences.serverUrl;

        if (baseURL[baseURL.length - 1] !== "/") {
            baseURL += "/";
        }
        baseURL += url;

        const options = {
            method: method,
            requestHeaders: {
                user: preferences.user,
                password: preferences.password,
                Accept: "application/json"
            }
        };

        if (postBody) {
            options.postBody = postBody;
        }
        return {url: baseURL, options: options};
    }

    makeRequest(preferences, url, method, postBody) {
        let baseURL = preferences.serverUrl;
        const sub = new Rx.AsyncSubject();
        const onsucc = response => {
            sub.onNext(response);
            sub.onCompleted();
        };
        const onfail = response => {
            sub.onError(response);
            sub.onCompleted();
        };

        if (baseURL[baseURL.length - 1] !== "/") {
            baseURL += "/";
        }
        baseURL += url;

        const options = {
            method: method,
            requestHeaders: {
                user: preferences.user,
                password: preferences.password,
                Accept: "application/json"
            },
            onSuccess: onsucc,
            onFailure: onfail
        };

        if (postBody) {
            options.postBody = postBody;
        }

        this.MashupPlatform.http.makeRequest(baseURL, options);
        return sub.asObservable();
    }

    askflavors(preferences) {
        const sub = this.makeRequest(preferences, "v1/flavors?public", "GET");

        sub.map(response => {
            return JSON.parse(response.response);
        }).map(data => [...data.flavors, {
            // this map will be removed, this is to test things :)
            disk: 3,
            public: true,
            name: "Should Be Removed",
            id: "random",
            ram: 512,
            vcpus: 2
        }, {
            disk: 1,
            public: false,
            name: "To check",
            id: "random2",
            ram: 1024,
            vcpus: 2
        }]).subscribe(data => {
            // Divide in public/private and set it
            const privateflavors = data.filter(f => !f.public);
            const publicflavors = data.filter(f => f.public);

            // On OK just dispatch everything :)
            // this.props.dispatch(setFlavors(data.flavors));
            this.props.dispatch(setFlavors(publicflavors, privateflavors));
            this.props.dispatch(clearLR());
        }, () => {
            // On error, clean everything!
            this.props.dispatch(setFlavors([], []));
            this.props.dispatch(clearLR());
        });
    }

    handleFlavorClick(dispatchf, data) {
        const {old, myname, othername, mylist, otherlist} = data;

        return function handler(id) {
            if (id === old) {
                this.props.dispatch(dispatchf("")); // Click in the same, clean it.
                return;
            }
            this.props.dispatch(dispatchf(id)); // dispatch the original one!

            if (this.props[othername] !== "") { // Send it!
                const myobj = mylist.find(x => x.id === id);
                const otherobj = otherlist.find(x => x.id === this.props[othername]);
                const tosend = {};

                if (typeof myobj === "undefined" || typeof otherobj === "undefined") {
                    window.console.error("Not find?");
                    return;
                }

                tosend[myname] = myobj;
                tosend[othername] = otherobj;
                this.MashupPlatform.wiring.pushEvent("compare", JSON.stringify(tosend));
            }
        }.bind(this);
    }

    render() {
        const buildDivStyle = float => {
            return {
                float: float,
                textAlign: "center",
                width: "50%"
            };
        };
        const divStyleL = buildDivStyle("left");
        const divStyleR = buildDivStyle("right");
        const {privateflavors,
               publicflavors,
               left,
               right,
               dispatch,
               filter,
               equalleft,
               equalright} = this.props;

        return (<div>
                <Header
                canclear={left !== ""}
                filter={filter}
                onClearClick={() => dispatch(clearLR())}
                onFilterClick={() => dispatch(toggleVisibility())}
                />
                <div>

                <div style={divStyleL}>
                <Label>Public Flavors</Label>
                <FlavorList
                activeid={left}
                equallist={equalleft}
                list={publicflavors}
                onFlavorClick={this.handleFlavorClick(
                    setLeft,
                    {
                        old: left,
                        myname: "left",
                        othername: "right",
                        mylist: publicflavors,
                        otherlist: privateflavors
                    }
                )}/>
                </div>

                <div style={divStyleR}>
                <Label>Private Flavors</Label>
                <FlavorList
                activeid={right}
                equallist={equalright}
                list={privateflavors}
                onFlavorClick={this.handleFlavorClick(
                    setRight,
                    {
                        old: right,
                        myname: "right",
                        othername: "left",
                        mylist: privateflavors,
                        otherlist: publicflavors
                    }
                )}/>
                </div>
                </div>

                </div>);
        // <Button bsStyle="info" className="compareBtn" disabled={left === "" || right === ""}
        // onMouseDown={ev => ev.preventDefault()}>Compare</Button>
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    equalleft: PropTypes.array.isRequired,
    equalright: PropTypes.array.isRequired,
    filter: PropTypes.bool.isRequired,
    left: PropTypes.string.isRequired,
    privateflavors: PropTypes.array.isRequired,
    publicflavors: PropTypes.array.isRequired,
    right: PropTypes.string.isRequired
};

export default connect(flavorSelectors)(App);
