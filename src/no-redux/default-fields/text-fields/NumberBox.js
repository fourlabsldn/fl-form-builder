import buildTextFieldConstructor from './buildTextFieldConstructor';

const TextBox = buildTextFieldConstructor({
  type: 'NumberBox',
  displayName: 'Number Box',
  htmlInputType: 'number',
});

export default TextBox;
