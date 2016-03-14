/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent(name) {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }

  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  this.element = this.createElement('div');
  this.name = name;
  this.init(name);
}

FormComponent.prototype.destroy = function destroy() {
  this.element.remove();
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
FormComponent.prototype.required = function required(isRequired) {
  var els = this.element.children;
  els.forEach(function (el) {
    el.setAttribute('required', true);
  });
};
