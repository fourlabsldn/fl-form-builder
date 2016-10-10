import React from 'react';
import ControlBar from './ControlBar';
import Fields from './Fields';
import assert from 'fl-assert';

import EventHub from './EventHub';

export default class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldTypes: {}, // each key is a fieldType and each value the type's react contructor
      fieldStates: [],
    };

    this.createField = this.createField.bind(this);
    this.deleteField = this.deleteField.bind(this);

    EventHub.on('createField', this.createField);
    EventHub.on('deleteField', this.deleteField);
  }

  createField(fieldType) {
    assert(
      this.state.fieldTypes[fieldType],
      `Field "${fieldType}" does not exist.`
    );

    const initialState = this.fieldTypes[fieldType].initialState();
    initialState.id = Date.now();

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

  render() {
    const {
      fieldTypes,
      fieldStates,
    } = this.state;

    return (
      <div className="fl-FormBuilder">
        <ControlBar fieldTypes={fieldTypes} />
        <Fields fieldStates={fieldStates} fieldTypes={fieldTypes} />
      </div>
    );
  }
}

FormBuilder.propTypes = {
  components: React.PropTypes.array,
};
