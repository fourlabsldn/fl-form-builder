import React from "react";
import FieldWrapper from "./FieldWrapper";

const Fields = ({ fieldTypes, fieldsState }) =>
(
  <div className="fl-fb-Fields">
    {fieldsState.map(compState => (
      <FieldWrapper
        key={compState.id}
        fieldState={compState}
        fieldConstructor={fieldTypes.find(t => t.info.type === compState.type)}
      />
    ))}
  </div>
);

Fields.propTypes = {
  fieldTypes: React.PropTypes.array.required,
  fieldsState: React.PropTypes.array.required,
};

export default Fields;
