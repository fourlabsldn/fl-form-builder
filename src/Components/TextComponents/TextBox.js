import TextComponent from '../TextComponent';

export default class TextBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Text Box';
    info.iconClass = 'glyphicon glyphicon-text-width';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'text');
  }
}
