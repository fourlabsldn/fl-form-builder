import TextComponent from './TextComponent';

export default class TextArea extends TextComponent {
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
