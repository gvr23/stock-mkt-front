import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

/** renders error message with styles if field validation fails */
function renderError(props) {
    if (typeof props.error == 'string')
        return <span
            className={"_input_error_container"}
        >
            <span
                style={props.errRel ? { position: 'relative', bottom: '0' } : {}}
                className={"_input_error"}
            >{props.error}</span>
        </span>
    return null;
}

/** Input component */
function Input(props) {
    return <div className={"field" + (props.noMargin ? ' _no_margin' : '') + (props.extra ? ' has-addons' : '')}>
        {props.prev ? <div className="control">
            {props.prev}
        </div> : null}
        <div className={"control" + (props.noPadding ? " _no_padding" : '') + (props.extra ? ' is-expanded' : '')}>
            {props.icon && <Icon
                name={props.icon}
                style={{
                    position: 'absolute',
                    left: 5,
                    color: "rgba(0,0,0,0.5)",
                    zIndex: 2,
                    ...props.iconStyle || {}
                }}
            />}
            <input
                {...props}
                onFocus={props.onFocus}
                className={`input ${props.className || ''}${props.icon ? ' _icon' : ''}`}
                style={props.style}
                type={props.type || 'text'}
                value={props.value}
                placeholder={props.placeholder}
                onChange={e => props.onChange(e)}
            />
            {renderError(props)}
        </div>
        {props.extra ? <div className="control">
            {props.extra}
        </div> : null}
    </div>
}


export default Input;

Input.propTypes = {
    /** value of the field */
    value: PropTypes.string,
    /** function to trigger on field value change */
    onChange: PropTypes.func.isRequired,
    /** placeholder to display in field */
    placeholder: PropTypes.string,
    /** label of the field */
    label: PropTypes.string,
    /** style of the label */
    labelStyle: PropTypes.object,
    /** style of the field */
    style: PropTypes.object,
    /** className of the field */
    className: PropTypes.string,
    /** type of the field */
    type: PropTypes.string,
    /** no padding or not */
    noPadding: PropTypes.bool,
    /** no margin or not */
    noMargin: PropTypes.bool,
    /** function to trigger on field focus */
    onFocus: PropTypes.func,
    /** icon to render if provided */
    icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /** style of the icon on input field */
    iconStyle: PropTypes.object,
    /** error to display if present */
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}