import React from "react";

import ConfigBar from "./FieldWrapper.ConfigBar";
import Sidebar from "./FieldWrapper.Sidebar";

const updateField = () => null;

const Field = ({ fieldState, fieldConstructor }) =>
(
  <div
    className={`fl-fb-Field ${
      fieldState.configShowing ? "fl-fb-Field--configuration-visible" : ""
    }`}
    data-id={fieldState.id}
  >
    <div className="fl-fb-Field-content">

      {React.createElement(
        fieldConstructor.RenderEditor,
        { state: fieldState, update: updateField }
      )}

    </div>
    <Sidebar fieldState={fieldState} />
    <ConfigBar fieldState={fieldState} />
  </div>
);

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object,
};

export default Field;
