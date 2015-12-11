"use strict";

import React, {PropTypes} from "react";
import {Nav, NavItem} from "react-bootstrap";

// Stateless component: https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
const FlavorList = props => {
    const {activeid, equallist, list, onFlavorClick} = props;
    const inEqualList = elemid => equallist.filter(x => x === elemid).length > 0;
    const items = list.map(e =>
        <NavItem
            className={(inEqualList(e.id)) ? "itemequal" : ""}
            eventKey={e.id}
            key={Math.random()}
            onMouseDown={ev => ev.preventDefault()}>
          {e.name}
        </NavItem>);

    return (<Nav activeKey={activeid} bsStyle="pills" onSelect={onFlavorClick} stacked>
            {items}
            </Nav>);
};

FlavorList.propTypes = {
    activeid: PropTypes.string.isRequired,
    equallist: PropTypes.array.isRequired,
    list: PropTypes.array.isRequired,
    onFlavorClick: PropTypes.func.isRequired
};

export default FlavorList;
