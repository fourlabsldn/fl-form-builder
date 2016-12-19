import React from "react";
import { prop, pipe, map, groupBy, toPairs } from "ramda";
import ButtonGroupDropdown from "./ButtonGroupDropdown";
import { undo } from "../../Actions";
import store from "../../store";

// FieldTypes -> [React.Component]
const fieldGroups = pipe(
  map(prop("info")),
  groupBy(prop("group")),
  toPairs,
  map(([groupName, groupButtons]) => (
    <ButtonGroupDropdown
      groupName={groupName}
      groupButtons={groupButtons}
    />
  ))
);

const ControlBar = ({ fieldTypes }) =>
(
  <div className="fl-fb-ControlBar">
    <div className="btn-group">
      {fieldGroups(fieldTypes)}
    </div>
    <button
      className="btn btn-primary"
      onClick={() => store.dispatch(undo())}
    > Undo </button>
  </div>
);

ControlBar.propTypes = {
  store: React.PropTypes.object.required,
  fieldTypes: React.PropTypes.array.required,
};

export default ControlBar;
