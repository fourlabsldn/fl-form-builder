import React from 'react';

const FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string,
  }),
  initialState: React.PropTypes.func,
  RenderConfigMode: React.PropTypes.func,
  RenderFormMode: React.PropTypes.func,
};

export default FieldCreatorPropType;
