import buildTextFieldConstructor from './buildTextFieldConstructor';

const EmailBox = buildTextFieldConstructor({
  type: 'EmailBox',
  displayName: 'Email Box',
  htmlInputType: 'email',
});

export default EmailBox;
