import React from 'react';
import ControlBar from './ControlBar';
import Fields from './Fields';
import assert from 'fl-assert';
import FieldCreatorPropType from './default-fields/FieldCreatorPropType';

import EventHub from './EventHub';

const createId = () => Date.now();

export default class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldTypes: props.fieldTypes || [], // TODO: Add validation here
      fieldStates: [],
      fieldStatesHistory: [], // array of fieldStates
    };

    this.createField = this.createField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.addFieldType = this.addFieldType.bind(this);
    this.updateField = this.updateField.bind(this);
    this.pushHistoryState = this.pushHistoryState.bind(this);
    this.pullHistoryState = this.pullHistoryState.bind(this);
    this.reorderFields = this.reorderFields.bind(this);

    EventHub.on('createField', this.createField);
    EventHub.on('deleteField', this.deleteField);
    EventHub.on('updateField', this.updateField);
    EventHub.on('undoBtnPressed', this.pullHistoryState);
    EventHub.on('fieldsReorder', this.reorderFields);

    // Expose function to export state.
    if (typeof props.exportState === 'function') {
      props.exportState(() => this.state.fieldStates);
    }

    if (typeof props.importState === 'function') {
      props.importState(fieldStates => {
        assert(
          Array.isArray(fieldStates),
          `Invalid states sent with importState. Expected Array but received ${typeof fieldStates}`
        );

        // Check that all types are ok.
        fieldStates.forEach(s => {
          if (!this.state.fieldTypes.map(f => f.info.type).includes(s.type)) {
            assert(false, `${s.type} is not included in field types.`);
          }
        });

        // Add required properties that are not managed by the field
        // component but by the FormBuilder component itself, so may
        // not be there.
        const processedFieldStates = fieldStates.map(s => Object.assign({
          configShowing: false,
          id: createId(),
          required: false,
        }, s));

        console.log(processedFieldStates);

        this.pushHistoryState(processedFieldStates);
      });
    }
  }

  // ==================== FIELDS HANDLING  ===========================

  createField(fieldType) {
    const typeConstructor = this.state.fieldTypes.find(f => f.info.type === fieldType);

    assert(typeConstructor, `Field "${fieldType}" does not exist.`);

    // HACK: This is a quick hack so that we can handle initial state if
    // it is a promise and if it isn't.
    Promise.resolve()
    .then(() => {
      return typeConstructor.initialState();
    })
    .then(initialState => {
      initialState.id = createId(); // eslint-disable-line no-param-reassign
      initialState.configShowing = true; // eslint-disable-line no-param-reassign

      // Make all other fields have config hidden
      const otherFieldsStates = this.state.fieldStates.map(s =>
        Object.assign({}, s, { configShowing: false })
      );

      const fieldStates = otherFieldsStates.concat([initialState]);
      this.pushHistoryState(fieldStates);
    });
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

  reorderFields(newFieldsIdOrder) {
    const fieldStates = newFieldsIdOrder
      .map(id => this.state.fieldStates.find(s => s.id.toString() === id));

    assert(
      fieldStates.indexOf(undefined) === -1,
      'There are ids that do not correspond to any fieldState.'
    );

    console.log('New order:', fieldStates.map(s => s.id).join(', '))

    this.pushHistoryState(fieldStates);
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
  importState: React.PropTypes.func,
};
