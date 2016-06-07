import Component from './FormComponent';

export default class Checkboxes extends Component {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildOptionsConfiguration();
    Object.preventExtensions(this);
  }

  addOption() {
    console.log('Adding an option');
  }

  removeOption() {
    console.log('Removing an option');
  }
}
