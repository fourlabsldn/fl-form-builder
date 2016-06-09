import OptionsComponent from './OptionsComponent';

export default class RadioBtns extends OptionsComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Radio Buttons';
    info.iconClass = 'glyphicon glyphicon-ok-circle';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);
    this.addOption('Insert an option');
  }

  /**
   * @override @method addOption
   * @param  {String} text
   */
  addOption(text) {
    super.addOption(text, 'radio');
  }
}
