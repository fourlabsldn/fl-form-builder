(function cssInjection() {
  'use strict';

  var linkTag1 = document.createElement('link');
  linkTag1.setAttribute('href', 'dist/fl-form-builder.css');
  linkTag1.setAttribute('rel', 'stylesheet');
  document.head.appendChild(linkTag1);

  var linkTag2 = document.createElement('link');
  linkTag2.setAttribute('href', 'bower_components/bootstrap/dist/css/bootstrap.css');
  linkTag2.setAttribute('rel', 'stylesheet');
  document.head.appendChild(linkTag2);
}());
