import React from "react";
import ControlBar from "./ControlBar";
import Fields from "./Fields";

const Main = ({ fieldTypes, fieldsState, fieldsStateHistory }) =>
(
  <div className="fl-fb">
    <ControlBar fieldTypes={fieldTypes} fieldsStateHistory={fieldsStateHistory} />
    <Fields fieldsState={fieldsState} fieldTypes={fieldTypes} />
  </div>
);

Main.propTypes = {
  fieldTypes: React.PropTypes.array.required,
  fieldsState: React.PropTypes.array.required,
  fieldsStateHistory: React.PropTypes.array.required,
};

export default Main;
