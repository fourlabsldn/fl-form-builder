/*globals FormComponent*/

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea(name) {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  FormComponent.apply(this); //Inheritance part
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  var area = document.createElement('textarea');
  ara.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-text-area');
  this.element.appendChild(area);
};
