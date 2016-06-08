import OptionsComponent from './OptionsComponent';

export default class Checkboxes extends OptionsComponent {
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
    super.addOption(text, 'checkbox');
  }
}
