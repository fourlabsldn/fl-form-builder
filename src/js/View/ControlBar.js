import React from 'react';

const ControlBar = ({ fieldTypes }) =>
(
  <div> Imagine a control bar with {fieldTypes.toString()}</div>
);

ControlBar.propTypes = {
  fieldTypes: React.PropTypes.array.required,
};

export default ControlBar;
