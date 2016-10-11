import React from 'react';

// This works as the interface for the FieldCreator Type
const FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string,
  }),
  initialState: React.PropTypes.func,
  RenderConfigMode: React.PropTypes.func, // React render function
  RenderFormMode: React.PropTypes.func, // React render function
};

export default FieldCreatorPropType;
