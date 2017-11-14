/* eslint-disable react/prop-types */
import React from "react";
import store from "../../store";
import { toggleConfig, toggleRequired } from "../../Actions";

const ConfigBar = ({ fieldState }) => (
  <div className="fl-fb-Field-configuration">
    <div className="fl-fb-Field-configuration-buttons">
      <label
        className="fl-fb-Field-configuration-switch-required"
        onMouseDown={() => store.dispatch(toggleRequired(fieldState))}
      >
        Required
        <div className="fl-fb-ui-switch">
          <input
            className="fl-fb-ui-switch-toggle fl-fb-ui-switch-toggle-round"
            type="checkbox"
            id={`fl-fb-ui-switch-${fieldState.id}`}
            checked={fieldState.required}
          />
          <label htmlFor={`fl-fb-ui-switch-${fieldState.id}`}> </label>
        </div >
      </label>

      <span className="fl-fb-Field-configuration-elementName">
        {fieldState.displayName}
      </span >

      <button
        className="fl-fb-Field-configuration-btn-ok btn btn-sm btn-default glyphicon glyphicon-ok"
        onClick={() => store.dispatch(toggleConfig(fieldState))}
        type="button"
      />
    </div >
  </div>
);

export default ConfigBar;
