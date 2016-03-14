function FormBody() {
  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form;
  var submitBtn;
  var components = [];

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    } else {
      components.push(comp);
      form.insertBefore(comp.element, submitBtn);
    }
  };

  this.init = function () {
    form = document.createElement('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');
    });

    var _this = this;
    form.addEventListener('newElement', function (e) {
      if (!e.detail) {
        console.error('No data in "newElement" event.');
        return;
      }

      _this.addElement(e.detail.element);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    form.appendChild(submitBtn);
    this.form = form;
  };

  this.init();
}
