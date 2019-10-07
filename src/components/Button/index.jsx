import React from 'react';
import PropTypes from 'prop-types';

/** Function to generate classNames for button component 
 *  @typedef {Object} props
 *  @property {bool} isFluid - is it fullwidth ot not
 *  @property {string} className - className
*/
function generateClassName(props) {
    return `button
    ${props.isFluid ? ' is-fullwidth' : ''}
${props.className ? ` ${props.className}` : ''}`
}

/** Renders button component */
function Button(props) {
    const {
        onClick
    } = props;
    return <button
        onClick={onClick}
        style={props.style || {}}
        className={generateClassName(props)}
        disabled={props.disabled}
    >{props.text}</button>

}

export default Button;

Button.propTypes = {
    /** style object */
    style: PropTypes.object,
    /** determines to take full width or not */
    isFluid: PropTypes.bool,
    /** className to set */
    className: PropTypes.string,
    /** determines if button is disabled or not */
    disabled: PropTypes.bool,
    /** text to show in button */
    text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

}