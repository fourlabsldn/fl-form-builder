var componentsArray = [//jshint ignore:line
  {
    name: 'Checkbox',
    componentType: 'Checkboxes',
    buttonName: 'Check',
    contentQuery: 'input[type=checkbox]', //query main element
    optionQuery: 'label' //query option element
  }, {
    name: 'Radio button',
    componentType: 'RadioBtns',
    buttonName: 'Radio',
    contentQuery: 'input[type=radio]',
    optionQuery: 'label' //query option element
  }, {
    name: 'Dropdown',
    componentType: 'Dropdown',
    buttonName: 'Drop',
    contentQuery: 'select',
    optionQuery: 'option' //query option element
  }, {
    name: 'Text box',
    componentType: 'TextBox',
    buttonName: '"Text box"',
    contentQuery: 'input[type=text]'
  }, {
    name: 'Text area',
    componentType: 'TextArea',
    buttonName: '"Text area"',
    contentQuery: 'textarea',
    focusElementNodeName: 'textarea',
  },
];
