import store from "./store";
import React from "react";
// This is used to make the store available to all components
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import assert from "fl-assert";
import View from "./View";
import { importState, importCustomComponents } from "./Actions";

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  ReactDOM.render(<Provider store={store}><View /></Provider>, container);

  store.dispatch(importCustomComponents(components));
  this.exportState = _ => store.getState().fieldsState;
  this.importState = s => store.dispatch(importState(s));
}

export default FormBuilder;
