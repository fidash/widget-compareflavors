"use strict";

import React, {PropTypes} from "react";
import {NavItem, Nav} from "react-bootstrap";

// Stateless component: https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
const FlavorList = props => {
    const items = props.list.
          map(e => <NavItem eventKey={e.id} key={e.id} onMouseDown={ev => ev.preventDefault()}>{e.name}</NavItem>);

    return (<Nav activeKey={props.activeid} bsStyle="pills" onSelect={props.onFlavorClick} stacked>
            {items}
            </Nav>);
};

FlavorList.propTypes = {
    activeid: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    onFlavorClick: PropTypes.func.isRequired
};

export default FlavorList;
