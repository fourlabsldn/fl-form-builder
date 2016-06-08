import TextComponent from './TextComponent';

export default class TextBox extends TextComponent {
  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'text');
  }
}
