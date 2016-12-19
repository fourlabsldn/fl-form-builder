import buildTextFieldConstructor from './buildTextFieldConstructor';

const TextBox = buildTextFieldConstructor({
  type: 'TextBox',
  displayName: 'Text Box',
  htmlInputType: 'text',
});

export default TextBox;
