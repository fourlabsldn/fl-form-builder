import store from "./store";
import React from "react";
import ReactDOM from "react-dom";
import assert from "fl-assert";
import View from "./View";
import { importState } from "./Actions";

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  ReactDOM.render(<View store={store} />, container);

  // TODO: Import custom components
  this.exportState = _ => store.getState().fieldsState;
  this.importState = s => store.dispatch(importState(s));
}

export default FormBuilder;
