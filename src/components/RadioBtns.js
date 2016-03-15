/*globals FormComponent*/

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns(name) {
  if (!(this instanceof RadioBtns)) { return new RadioBtns(); }

  this.init(name);
}

RadioBtns.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  var legend = document.createElement('input');
  legend.setAttribute('placeholder', 'Description');
  legend.setAttribute('type', 'text');
  this.focusElement = legend;

  var addBtn = document.createElement('i');
  addBtn.classList.add('glyphicon');
  addBtn.classList.add('glyphicon-plus-sign');
  addBtn.classList.add('fl-grey-btn');

  var _this = this;
  addBtn.addEventListener('click', function () {

    //Blink red and return if no value was provided
    if (!legend.value.trim()) {
      legend.classList.add('fl-blink-red');
      setTimeout(function () {
        legend.classList.remove('fl-blink-red');
      }, 1500);

      return;
    }

    _this.add(legend.value);
    legend.value = '';
  });

  this.configContent.appendChild(addBtn);
  this.configContent.appendChild(legend);

  //Add placeholder
  this.addPlaceHolder();
};

/**
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return HTMLElement the element added
 */
RadioBtns.prototype.add = function add(value, legend) {
  if (!value) {
    throw new Error('RadioBtns.add(): ' + value + ' is not a valid "value" parameter');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newRadio = document.createElement('input');
  newRadio.setAttribute('type', 'radio');
  newRadio.setAttribute('name', this.name);
  newRadio.setAttribute('value', value);
  newRadio.classList.add('fl-radio-btn');

  var newLabel = document.createElement('label');
  var labelText = document.createTextNode(legend || value);
  newLabel.appendChild(newRadio);
  newLabel.appendChild(labelText);

  this.content.appendChild(newLabel);
  return newRadio;
};
