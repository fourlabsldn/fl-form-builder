import FormComponent from '../FormComponent';

/**
 * @class TextArea
 * @extends FormComponent
 */
export default function TextArea(name) {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  this.init(name);
}

TextArea.prototype = new FormComponent(); //Inheritance part
TextArea.prototype.componentType = 'TextArea';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var area = document.createElement('textarea');
  area.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-editable', 'fl-text-area', 'form-control');
  labelEl.appendChild(area);

  this.content.appendChild(labelEl);
  this.focusElement = area;
};

TextArea.prototype.setTitle = function setTitle(desc) {
  if (!desc || !this.title) { return; }

  this.title.innerText = desc;
};
