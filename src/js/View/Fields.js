import React from 'react';

const Fields = ({ fieldTypes, fieldsState }) =>
(
  <div>
    Imagine the following fields: {fieldTypes.toString()}
    With the following field states: {fieldsState.toString()}
  </div>
);

Fields.propTypes = {
  fieldTypes: React.PropTypes.array.required,
  fieldsState: React.PropTypes.array.required,
};

export default Fields;
