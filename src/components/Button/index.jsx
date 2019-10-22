import React, { useState } from 'react';
import PropTypes from 'prop-types';

/** Function to generate classNames for button component 
 *  @typedef {Object} props
 *  @property {bool} isFluid - is it fullwidth ot not
 *  @property {string} className - className
*/
function generateClassName(props, clickReady = false) {
    return `button
    ${props.isFluid ? ' is-fullwidth' : ''}
${props.className ? ` ${props.className}` : ''}
${props.isLoading ? ' is-loading' : ''}
${clickReady ? ' is-success' : ''}
`
}


/** Renders button component */
function Button(props) {
    const [clickReady, setClickReady] = useState(false);
    if (props.isConfirm) {
        return <button
            onClick={(e) => {
                e.preventDefault()
                if (!clickReady) {
                    setClickReady(true)
                    setTimeout(() => {
                        setClickReady(false)
                    }, 3000)
                } else {
                    props.onClick()
                    setClickReady(false)
                }
            }}
            style={props.style || {}}
            className={generateClassName(props, clickReady)}
            disabled={props.disabled}
            dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
        >{clickReady ? props.textConfirm : props.text}</button>
    }
    const {
        onClick
    } = props;
    return <button
        onClick={onClick}
        title={props.title}
        style={props.style || {}}
        className={generateClassName(props)}
        disabled={props.disabled}
        dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
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
