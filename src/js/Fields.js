import React from 'react';
import ReactDOM from 'react-dom';

import Field from './Field';

const Fields = props => {
  const {
    fieldStates,
    fieldTypes,
  } = props;

  return (
    <div>
      {fieldStates.forEach(compState => (
        <Field
          fieldState={compState}
          fieldConstructor={fieldTypes[compState.type]}
        />
      ))}
    </div>
  );
};

Fields.propTypes = {
  states: React.PropTypes.array,
};

export default Fields;
