import buildTextFieldConstructor from './buildTextFieldConstructor';

const TextBox = buildTextFieldConstructor({
  type: 'TelephoneBox',
  displayName: 'Telephone Box',
  htmlInputType: 'tel',
});

export default TextBox;
