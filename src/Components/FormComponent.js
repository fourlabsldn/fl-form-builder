import ViewController from '../ViewController';
/**
 * @abstract @class FormComponent
 */
export default class FormComponent extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);

    this.buildHtml();
  }

  buildHtml() {

  }
}
