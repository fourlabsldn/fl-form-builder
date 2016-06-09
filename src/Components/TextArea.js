import TextComponent from './TextComponent';

export default class TextArea extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Text Area';
    info.iconClass = 'glyphicon glyphicon-text-height';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'textarea');
  }

  /**
   * @override @method buildComponent
   */
  buildComponent(...args) {
    super.buildComponent(...args);
    this.html.textElement.setAttribute('rows', 5);
  }
}
