import TextComponent from '../TextComponent';

export default class NumberBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Number Box';
    info.iconClass = 'glyphicon glyphicon-subscript';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'number');
  }
}
