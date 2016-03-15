/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  this.element = document.createElement('div');
  this.element.classList.add('fl-component');
  this.element.classList.add('col-md-11');
  this.element.classList.add('form-group');
  this.name = name;
  this.createControls();
};

FormComponent.prototype.createControls = function createControls() {

  //Create side control bar
  var controls = document.createElement('div');
  controls.classList.add('fl-component-side-control');

  var dragBtn = document.createElement('i');
  dragBtn.classList.add('glyphicon');
  dragBtn.classList.add('glyphicon-menu-hamburger');
  controls.appendChild(dragBtn);

  var moreConfigBtn = document.createElement('button');
  moreConfigBtn.classList.add('glyphicon');
  moreConfigBtn.classList.add('glyphicon-cog');
  controls.appendChild(moreConfigBtn);

  var _this = this;
  moreConfigBtn.addEventListener('click', function () {
    _this.moreConfigToggle();
  });

  //Create configuration box
  var configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  var deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn');
  deleteBtn.classList.add('btn-danger');
  deleteBtn.classList.add('btn-sm');
  deleteBtn.classList.add('fl-bottom-btn');
  deleteBtn.innerText = 'Delete';
  deleteBtn.addEventListener('click', function () {
    _this.destroy();
  });

  configBox.appendChild(deleteBtn);

  var okBtn = document.createElement('button');
  okBtn.classList.add('btn');
  okBtn.classList.add('btn-default');
  okBtn.classList.add('btn-sm');
  okBtn.classList.add('fl-bottom-btn');
  okBtn.innerText = 'Ok';
  okBtn.addEventListener('click', function () {
    _this.saveConfig();
    _this.moreConfigToggle();
  });

  configBox.appendChild(okBtn);
  this.element.appendChild(configBox);
  this.element.appendChild(controls);
};

FormComponent.prototype.moreConfigToggle = function moreConfigToggle(showHide) {
  if (!this.configBox) {
    throw new Error('FormComponent.moreConfigToggle(): No configBox initialised');
  }

  if (showHide === true) {
    this.element.classList.add('fl-form-config-visible');
  } else if (showHide === false) {
    this.element.classList.remove('fl-form-config-visible');
  } else {
    this.element.classList.toggle('fl-form-config-visible');
  }
};

//To be implemented by child clases
FormComponent.prototype.saveConfig = function saveConfig() {

};

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

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.add('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
};
