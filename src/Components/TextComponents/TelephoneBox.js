import TextComponent from '../TextComponent';

export default class TelephoneBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Telephone Box';
    info.iconClass = 'glyphicon glyphicon-earphone';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'tel');
  }
}
