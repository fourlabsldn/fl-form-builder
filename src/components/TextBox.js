/*globals FormComponent*/

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox() {
  if (!(this instanceof TextBox)) { return new TextBox(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

TextBox.prototype.init = function init() {

}
