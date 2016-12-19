import React from 'react';
import ControlBar from './ControlBar';
import Fields from './Fields';

const Main = ({ fieldTypes, fieldsState }) =>
(
  <div className="fl-fb">
    <ControlBar fieldTypes={fieldTypes} />
    <Fields fieldsState={fieldsState} fieldTypes={fieldTypes} />
  </div>
);

Main.propTypes = {
  fieldTypes: React.PropTypes.array.required,
  fieldsState: React.PropTypes.array.required,
};

export default Main;
