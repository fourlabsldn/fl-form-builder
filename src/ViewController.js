/**
 * This class creates elements with an html counterpart.
 * HTML components are stored in this.html, and the main container
 * is this.html.container.
 * @abstract @class
 */

export default class ViewController {
  constructor(modulePrefix) {
    this.html = {};
    this.html.container = document.createElement('div');

    this.modulePrefix = modulePrefix;
    this.cssPrefix = `${this.modulePrefix}-${this.constructor.name}`;
    this.html.container.classList.add(this.cssPrefix);
  }

  destroy() {
    this.html.container.remove();
    this.html = {};
  }

  getHtmlContainer() {
    return this.html.container;
  }
}
