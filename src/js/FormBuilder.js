import React from 'react';
import ControlBar from './ControlBar';
import Fields from './Fields';
import assert from 'fl-assert';
import FieldCreatorPropType from './DefaultFields/FieldCreatorPropType';

import EventHub from './EventHub';

export default class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldTypes: props.fieldTypes, // TODO: Add validation here
      fieldStates: [],
    };

    this.createField = this.createField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.addFieldType = this.addFieldType.bind(this);

    EventHub.on('createField', this.createField);
    EventHub.on('deleteField', this.deleteField);
  }

  createField(fieldType) {
    const typeConstructor = this.state.fieldTypes.find(f => f.info.type === fieldType);

    assert(typeConstructor, `Field "${fieldType}" does not exist.`);

    const initialState = typeConstructor.initialState();
    initialState.id = Date.now();
    initialState.configShowing = true;

    const fieldStates = this.state.fieldStates.concat([initialState]);
    this.setState({ fieldStates });
  }

  deleteField(fieldState) {
    const fieldStates = this.state.fieldStates.filter(
      state => state.id !== fieldState.id
    );

    assert(
      fieldStates.length < this.state.fieldStates,
      'Something weird happened. The field didn\'t seem to be part of the existing states'
    );
    this.setState({ fieldStates });
  }

  addFieldType(newType) {
    assert(
      !this.state.fieldTypes.find(f => f.info.type === newType.info.type),
      `The field type ${newType.info.type} already exists`
    );

    const fieldTypes = this.state.fieldTypes.concat([newType]);

    this.setState({ fieldTypes });
  }

  render() {
    const {
      fieldTypes,
      fieldStates,
    } = this.state;

    return (
      <div className="fl-fb">
        <ControlBar fieldTypes={fieldTypes} />
        <Fields fieldStates={fieldStates} fieldTypes={fieldTypes} />
      </div>
    );
  }
}

FormBuilder.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType),
};
