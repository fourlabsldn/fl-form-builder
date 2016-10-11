import React from 'react';
import ControlBar from './ControlBar';
import Fields from './Fields';
import assert from 'fl-assert';
import FieldCreatorPropType from './default-fields/FieldCreatorPropType';

import EventHub from './EventHub';

export default class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldTypes: props.fieldTypes, // TODO: Add validation here
      fieldStates: [],
      fieldStatesHistory: [], // array of fieldStates
    };

    this.createField = this.createField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.addFieldType = this.addFieldType.bind(this);
    this.updateField = this.updateField.bind(this);
    this.pushHistoryState = this.pushHistoryState.bind(this);
    this.pullHistoryState = this.pullHistoryState.bind(this);

    EventHub.on('createField', this.createField);
    EventHub.on('deleteField', this.deleteField);
    EventHub.on('updateField', this.updateField);
    EventHub.on('undoBtnPressed', this.pullHistoryState);

    // Expose function to export state.
    props.exportState(() => this.state.fieldStates);
  }

  // ==================== FIELDS HANDLING  ===========================

  createField(fieldType) {
    const typeConstructor = this.state.fieldTypes.find(f => f.info.type === fieldType);

    assert(typeConstructor, `Field "${fieldType}" does not exist.`);

    const initialState = typeConstructor.initialState();
    initialState.id = Date.now();
    initialState.configShowing = true;

    // Make all other fields have config hidden
    const otherFieldsStates = this.state.fieldStates.map(s =>
      Object.assign({}, s, { configShowing: false })
    );

    const fieldStates = otherFieldsStates.concat([initialState]);
    this.pushHistoryState(fieldStates);
  }

  deleteField(fieldState) {
    const fieldStates = this.state.fieldStates.filter(
      state => state.id !== fieldState.id
    );

    assert(
      fieldStates.length < this.state.fieldStates.length,
      `Something weird happened.
       Field with ID ${fieldState.is} didn\'t seem to be part of the existing states`
    );

    this.pushHistoryState(fieldStates);
  }


  updateField(fieldState) {
    const stateIndex = this.state.fieldStates.findIndex(s => s.id === fieldState.id);

    assert(
      stateIndex !== -1,
      `Field with id ${fieldState.id} is not in field states`
    );

    const fieldStates = Array.from(this.state.fieldStates);
    fieldStates[stateIndex] = fieldState;
    this.pushHistoryState(fieldStates);
  }

  addFieldType(newType) {
    assert(
      !this.state.fieldTypes.find(f => f.info.type === newType.info.type),
      `The field type ${newType.info.type} already exists`
    );

    const fieldTypes = this.state.fieldTypes.concat([newType]);

    this.setState({ fieldTypes });
  }

  // ==================== HISTORY HANDLING  ===========================

  pushHistoryState(fieldStates) {
    // Add active state to head and set new state as active
    const currentFieldStates = this.state.fieldStates;
    const fieldStatesHistory = [currentFieldStates].concat(this.state.fieldStatesHistory);
    this.setState({
      fieldStatesHistory,
      fieldStates,
    });
  }

  pullHistoryState() {
    // Remove head
    const fieldStatesHistory = this.state.fieldStatesHistory.slice(1);
    // Head is now the active state
    const fieldStates = this.state.fieldStatesHistory[0] || [];
    this.setState({
      fieldStatesHistory,
      fieldStates,
    });
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
  exportState: React.PropTypes.func,
};
