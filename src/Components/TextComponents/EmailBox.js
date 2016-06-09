import TextComponent from '../TextComponent';

export default class EmailBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Email Box';
    info.iconClass = 'glyphicon glyphicon-envelope';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'email');
  }
}
