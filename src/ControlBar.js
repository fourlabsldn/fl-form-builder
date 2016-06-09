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
      const expansibleBtn = createExapansibleButton(
        group,
        componentGroups[group],
        buttonsClass
      );
      componentsBtnGroups.appendChild(expansibleBtn);
    }

    // Add listeners to all component creation buttons
    componentsBtnGroups.querySelectorAll(`.${buttonsClass}`).forEach(btn => {
      btn.addEventListener('click', () => {
        this.moduleCoordinator.createComponent(btn.name);
      });
    });

    const actionsBtnGroup = createButtonGroup();
    // Create Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = `${this.cssPrefix}-button-save`;
    saveBtn.classList.add(
      'btn', // Bootstrap
      'btn-primary'
    );
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => this.moduleCoordinator.save());
    actionsBtnGroup.appendChild(saveBtn);

    // Create Import button
    const undoBtn = document.createElement('button');
    undoBtn.className = `${this.cssPrefix}-button-save`;
    undoBtn.classList.add('btn', 'btn-default'); // Bootstrap
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

function createExapansibleButton(buttonName, subButtons, subButtonsClass) {
  const btnGroup = createButtonGroup();
  const btn = document.createElement('button');
  btn.classList.add(
    'btn',
    'btn-default',
    'dropdown-toggle'
  );
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-toggle', 'dropdown');
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');

  const arrowDown = document.createElement('span');
  arrowDown.classList.add('caret');

  btn.textContent = buttonName;
  btn.appendChild(arrowDown);
  btnGroup.appendChild(btn);

  const list = document.createElement('ul');
  list.classList.add('dropdown-menu');

  for (const buttonInfo of subButtons) {
    const listItem = document.createElement('li');
    const clickable = document.createElement('a');
    clickable.name = buttonInfo.name;
    clickable.textContent = buttonInfo.description;
    clickable.classList.add(subButtonsClass);

    listItem.appendChild(clickable);
    list.appendChild(listItem);
  }

  btnGroup.appendChild(list);
  return btnGroup;
}
