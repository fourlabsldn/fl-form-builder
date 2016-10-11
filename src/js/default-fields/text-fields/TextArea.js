import buildTextFieldConstructor from './buildTextFieldConstructor';

const TextBox = buildTextFieldConstructor({
  type: 'TextArea',
  displayName: 'Text Area',
  htmlElement: 'textarea',
});

export default TextBox;
