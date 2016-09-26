import ViewController from './ViewController';
import utils from './utils/utils';

/**
 * @class ControlBar
 */
export default class ControlBar extends ViewController {
  constructor(modulePrefix, moduleCoordinator) {
    super(modulePrefix);
    this.moduleCoordinator = moduleCoordinator;
    Object.preventExtensions(this);
    this.buildHtml();
  }

  buildHtml() {
    const componentGroups = {};
    const componentTypes = this.moduleCoordinator.getComponentTypes();

    // Create component buttons
    for (const component of componentTypes) {
      componentGroups[component.group] = componentGroups[component.group] || [];
      componentGroups[component.group].push(component);
    }

    const componentsBtnGroups = createButtonGroup();
    const buttonsClass = `${this.cssPrefix}-button-component`;
    for (const group of Object.keys(componentGroups)) {
      const dropdown = createDropdown(
        group,
        componentGroups[group],
        buttonsClass
      );
      componentsBtnGroups.appendChild(dropdown);
    }

    // Add listeners to all component creation buttons
    const buttons = Array.from(componentsBtnGroups.querySelectorAll(`.${buttonsClass}`));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.moduleCoordinator.createComponent(btn.name);
      });
    });

    const actionsBtnGroup = createButtonGroup();
    // // Create Save button
    // const saveBtn = document.createElement('button');
    // saveBtn.className = `${this.cssPrefix}-button-save`;
    // saveBtn.classList.add(
    //   'btn', // Bootstrap
    //   'btn-primary'
    // );
    // saveBtn.textContent = 'Save';
    // saveBtn.addEventListener('click', () => this.moduleCoordinator.save());
    // actionsBtnGroup.appendChild(saveBtn);

    // Create Import button
    const undoBtn = document.createElement('button');
    undoBtn.className = `${this.cssPrefix}-button-save`;
    undoBtn.classList.add('btn', 'btn-primary'); // Bootstrap
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      const undoSuccess = this.moduleCoordinator.popHistoryState();
      if (!undoSuccess) {
        utils.blinkRed(undoBtn, this.modulePrefix);
      }
    });
    actionsBtnGroup.appendChild(undoBtn);

    this.html.container.appendChild(componentsBtnGroups);
    this.html.container.appendChild(actionsBtnGroup);
  }
}


function createButtonGroup() {
  const group = document.createElement('div');
  group.classList.add('btn-group');
  group.setAttribute('role', 'group');
  return group;
}

function createDropdown(buttonName, subButtons, subButtonsClass) {
  const wrapper = document.createElement('div');
  wrapper.classList.add(
    'btn', // Bootstrap
    'btn-default',
    'fl-fb-ControlBar-dropdown'
  );

  const mainButton = document.createElement('label');
  mainButton.classList.add('fl-fb-ControlBar-dropdown-checkbox-label');
  mainButton.textContent = buttonName;
  wrapper.appendChild(mainButton);

  const arrowDown = document.createElement('span');
  arrowDown.classList.add('caret');
  mainButton.appendChild(arrowDown);

  const list = document.createElement('ul');
  list.classList.add('fl-fb-ControlBar-dropdown-content');

  for (const buttonInfo of subButtons) {
    const listItem = document.createElement('li');
    const clickable = document.createElement('a');
    clickable.name = buttonInfo.name;
    clickable.textContent = buttonInfo.description;
    clickable.classList.add(subButtonsClass);

    listItem.appendChild(clickable);
    list.appendChild(listItem);
  }

  wrapper.appendChild(list);
  return wrapper;
}
