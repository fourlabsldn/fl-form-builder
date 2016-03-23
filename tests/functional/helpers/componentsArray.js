var componentsArray = [//jshint ignore:line
  {
    name: 'Checkbox',
    buttonName: 'Check',
    contentQuery: 'input[type=checkbox]', //query main element
    optionQuery: 'label' //query option element
  }, {
    name: 'Radio button',
    buttonName: 'Radio',
    contentQuery: 'input[type=radio]',
    optionQuery: 'label' //query option element
  }, {
    name: 'Dropdown',
    buttonName: 'Drop',
    contentQuery: 'select',
    optionQuery: 'option' //query option element
  }, {
    name: 'Text box',
    buttonName: '"Text box"',
    contentQuery: 'input[type=text]'
  }, {
    name: 'Text area',
    buttonName: '"Text area"',
    contentQuery: 'textarea',
    focusElementNodeName: 'textarea',
  },
];
