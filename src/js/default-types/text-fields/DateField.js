import buildTextFieldConstructor from './buildTextFieldConstructor';

const DateBox = buildTextFieldConstructor({
  type: 'DateBox',
  displayName: 'Date Field',
  htmlInputType: 'date',
});

export default DateBox;
