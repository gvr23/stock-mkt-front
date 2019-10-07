import React from 'react';
import PropTypes from 'prop-types';

/** Icon component */
function Icon(props) {

  return <React.Fragment>
    <span
      onClick={props.onClick}
      style={props.style || {}}
      className={`icon${props.className ? ` ${props.className}` : ''}`}>
      {props.text ? <span
        style={props.labelStyle || {}}
        className={"_text"}
      >{props.text}</span> : false}<i className={`fas fa-${props.name}`}></i>
      {typeof props.subText === 'string' && props.subText !== '' ? <span
        style={{
          position: 'absolute',
          bottom: 10,
          fontWeight: 500,
          fontSize: '1rem',
          right: 5
        }}
      >{props.subText}</span> : false}
    </span>

  </React.Fragment>
}

export default Icon;

Icon.propTypes = {
  /** icon click function */
  onClick: PropTypes.func,
  /** icon style object */
  style: PropTypes.object,
  /** icon class */
  className: PropTypes.string,
  /** icon's label style */
  labelStyle: PropTypes.object,
  /** icon name from font awesome */
  name: PropTypes.string,
  /** render span with text if provided instead of icon */
  text: PropTypes.string,
  /** renders subtext if provided */
  subText: PropTypes.string
}