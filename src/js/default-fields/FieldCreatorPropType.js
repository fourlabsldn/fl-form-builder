import React from 'react';

// This works as the interface for the FieldCreator Type
const FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string,
  }),
  initialState: React.PropTypes.func,
  processStateToExport: React.PropTypes.func,
  RenderEditor: React.PropTypes.func, // React render function
};

/**
 * The initial State function returns:
 * {
   type: React.PropTypes.string,
   group: React.PropTypes.string,
   displayName: React.PropTypes.string,

   required: React.PropTypes.bool,
   configShowing: React.PropTypes.bool,
 }
 */
export default FieldCreatorPropType;
