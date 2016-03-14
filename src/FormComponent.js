/**
 * Parent class for form components
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }

  this.container = this.createElement('div');
}

FormComponent.prototype.destroy = function destroy() {
  this.container.remove();
};
