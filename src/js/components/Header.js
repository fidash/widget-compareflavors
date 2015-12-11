"use strict";

import React, {PropTypes} from "react";
import {Button, ButtonToolbar} from "react-bootstrap";

// Stateless component: https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
const Header = props => {
    const {onTest, canclear, cancopy, canreplace, candelete, filter, onFilterClick, onClearClick, onCopyFlavor, onReplaceFlavor, onDeleteFlavor} = props;

    return (
        <ButtonToolbar className="text-right myheader">
            <Button bsStyle={(filter) ? "danger" : "success"} onClick={onFilterClick} onMouseDown={ev => ev.preventDefault()}>
            {(filter) ? "Show equals" : "Hide equals"}</Button>
            <Button bsStyle="info" onClick={onCopyFlavor} disabled={!cancopy} onMouseDown={ev => ev.preventDefault()}><i className="fa fa-files-o"></i> Copy</Button>
            <Button bsStyle="danger" onClick={onReplaceFlavor} disabled={!canreplace} onMouseDown={ev => ev.preventDefault()}><i className="fa fa-retweet"></i> Replace</Button>
            <Button bsStyle="danger" onClick={onDeleteFlavor} disabled={!candelete} onMouseDown={ev => ev.preventDefault()}><i className="fa fa-trash"></i> Delete</Button>
            <Button bsStyle="info" disabled={!canclear} onClick={onClearClick} onMouseDown={ev => ev.preventDefault()}><i className="fa fa-eraser"></i> Clear</Button>
        </ButtonToolbar>
    );
};

Header.propTypes = {
    canclear: PropTypes.bool.isRequired,
    candelete: PropTypes.bool.isRequired,
    cancopy: PropTypes.bool.isRequired,
    canreplace: PropTypes.bool.isRequired,
    filter: PropTypes.bool.isRequired,
    onClearClick: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired,
    onCopyFlavor: PropTypes.func.isRequired,
    onReplaceFlavor: PropTypes.func.isRequired,
    onDeleteFlavor: PropTypes.func.isRequired
};

export default Header;
