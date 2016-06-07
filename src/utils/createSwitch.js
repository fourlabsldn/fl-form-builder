export default function createSwitch(labelText, modulePrefix) {
  const cssPrefix = `${modulePrefix}-ui-switch`;

  const wrapper = document.createElement('label');
  wrapper.textContent = labelText;

  const switchElement = document.createElement('div');
  switchElement.classList.add(cssPrefix);


  const switchInput = document.createElement('input');
  switchInput.classList.add(`${cssPrefix}-toggle`);
  switchInput.classList.add(`${cssPrefix}-toggle-round`);
  switchInput.type = 'checkbox';
  switchInput.id = `${cssPrefix}-${Date.now()}`;
  switchElement.appendChild(switchInput);

  const switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  switchElement.appendChild(switchLabel);

  wrapper.appendChild(switchElement);
  return wrapper;
}
