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
  this.element.classList.add('col-md-12');
  this.element.classList.add('form-group');
  this.name = name;
  this.createControls();
};

FormComponent.prototype.createControls = function createControls() {

  //Create side control bar -----------------------------
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
    _this.configToggle();
  });

  //Create configuration box -----------------------------
  var configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  //Component-specific content wrapper
  var configContent = document.createElement('div');
  configContent.classList.add('full-width');
  this.configContent = configContent;
  configBox.appendChild(configContent);

  //Bottom buttons container
  var buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('col-sm-12');

  var deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn');
  deleteBtn.classList.add('btn-danger');
  deleteBtn.classList.add('btn-sm');
  deleteBtn.classList.add('fl-bottom-btn');
  deleteBtn.innerText = 'Delete';
  deleteBtn.addEventListener('click', function () {
    _this.destroy();
  });

  buttonsContainer.appendChild(deleteBtn);

  var okBtn = document.createElement('button');
  okBtn.classList.add('btn');
  okBtn.classList.add('btn-default');
  okBtn.classList.add('btn-sm');
  okBtn.classList.add('fl-bottom-btn');
  okBtn.innerText = 'Ok';
  okBtn.addEventListener('click', function () {
    _this.saveConfig();
    _this.configToggle();
  });

  buttonsContainer.appendChild(okBtn);
  var requiredLabel = document.createElement('label');
  requiredLabel.innerText = 'Required';

  //Switch for whether the field is required or not.
  var requiredSwitch = document.createElement('div');
  requiredSwitch.classList.add('switch');

  var switchInput = document.createElement('input');
  switchInput.classList.add('cmn-toggle');
  switchInput.classList.add('cmn-toggle-round');
  switchInput.setAttribute('type', 'checkbox');
  switchInput.id = 'cmn-toggle-1';
  switchInput.addEventListener('change', function () {
    _this.required(true);
  });

  requiredSwitch.appendChild(switchInput);

  var switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', 'cmn-toggle-1');
  requiredSwitch.appendChild(switchLabel);

  requiredLabel.appendChild(requiredSwitch);
  buttonsContainer.appendChild(requiredLabel);

  configBox.appendChild(buttonsContainer);

  this.element.appendChild(configBox);
  this.element.appendChild(controls);
};

FormComponent.prototype.configToggle = function configToggle(showHide) {
  if (!this.configBox) {
    throw new Error('FormComponent.configToggle(): No configBox initialised');
  }

  if (showHide === true) {
    this.element.classList.add('fl-form-config-visible');
    this.configShowing = true;
  } else if (showHide === false) {
    this.element.classList.remove('fl-form-config-visible');
    this.configShowing = false;
  } else {
    this.element.classList.toggle('fl-form-config-visible');
    this.configShowing = !this.configShowing;
  }

  var configShowing = this.configShowing;
  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';

  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', configShowing);

    //Show message to input placeholder text if there is no placeholder already
    //in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || (el.nodeName === 'INPUT' && el.type === 'text')) {
      var placeholderText = el.getAttribute('placeholder');
      var value = el.value;

      if (configShowing) {
        var newContent = (placeholderText) ? placeholderText : placeholderMessage;
        el.setAttribute('placeholder', newContent);
      } else if (value) {
        el.setAttribute('placeholder', value);
      }else if (placeholderText ===  placeholderMessage) {
        el.removeAttribute('placeholder');
      }

      el.value = '';
    }
  });
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
  var inputs = this.element.querySelectorAll('input');
  var textAreas = this.element.querySelectorAll('textarea');
  var checkboxes = this.element.querySelectorAll('checkboxes');

  var els = [].concat.call(inputs, textAreas, checkboxes);
  [].forEach.call(els, function (el) {
    if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
      el.setAttribute('required', true);
    }
  });
};

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.add('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
};
