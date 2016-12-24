import onDrag from "./onDrag";
import dragEnd from "./dragEnd";

export const effectsManager = (initialModel, updateFunction) => {
  let model = initialModel;
  return {
    update: action => {
      model = updateFunction(model, action);
    },
  };
};

export const actionCreators = {
  dragEnd: _ => ({ type: "dragEnd" }),
  drag: e => ({ type: "drag", eventY: e.pageY }),
};

export const updateFunction = (model, action) => {
  switch (action.type) {
  case "dragEnd":
    return dragEnd(model, action);
  case "drag":
    onDrag(model, action);
    return model;
  default:
    throw new Error(`Unexpected action in trackReorderDrag: ${action.type}`);
  }
};
