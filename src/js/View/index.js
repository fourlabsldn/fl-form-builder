/* eslint-disable no-nested-ternary */
/*

  In this file we connect the state, the update functions and the View.


 */
import Main from './Main';
import { connect } from 'react-redux';
// import {} from '../Update';

// Hook things up here.
const mapStateToProps = state =>
({
  fieldTypes: state.fieldTypes,
  fieldsState: state.fieldsState,
});

const mapDispatchToProps = () => ({});

const FormBuilder = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

export default FormBuilder;
