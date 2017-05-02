import buildTextFieldConstructor from './buildTextFieldConstructor';

const DateField = buildTextFieldConstructor({
  type: 'DateField',
  displayName: 'Date Field',
  htmlInputType: 'date',
});

export default DateField;
