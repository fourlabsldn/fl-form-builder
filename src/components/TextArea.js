/*globals FormComponent*/

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea() {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

TextArea.prototype.init = function init() {

}
