import React from 'react';
import { curry } from 'lodash';
import FieldCreatorPropType from './default-fields/FieldCreatorPropType';

import Field from './Field';

const getTypeConstructor = curry((typeConstructors, type) => {
  return typeConstructors.find(t => t.info.type === type);
});

const Fields = props => {
  const {
    fieldStates,
    fieldTypes,
  } = props;

  return (
    <div className="fl-fb-Fields">
      {fieldStates.map(compState => (
        <Field
          key={compState.id}
          fieldState={compState}
          fieldConstructor={getTypeConstructor(fieldTypes, compState.type)}
        />
      ))}
    </div>
  );
};

Fields.propTypes = {
  fieldStates: React.PropTypes.array,
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType),
};

export default Fields;
