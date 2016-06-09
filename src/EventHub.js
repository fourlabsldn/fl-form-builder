/* eslint-disable no-param-reassign */
import assert from 'fl-assert';

export default class EventHub {
  static decorate(instance, eventNames) {
    instance.listeners = {};
    for (const eventName of eventNames) {
      instance.listeners[eventName] = new Set();
    }

    instance.on = on.bind(instance);
    instance.removeListener = removeListener.bind(instance);
    instance.trigger = trigger.bind(instance);
  }
}

/**
 * @method on
 * @param  {function} fn
 * @param {String} event
 * @return {void}
 */
function on(event, fn) {
  assert(this.listeners[event], `Trying to listen to invalid event: ${event}`);
  this.listeners[event].add(fn);
}

/**
 * @method removeListener
 * @param  {String} event
 * @param  {Function} fn
 * @return {void}
 */
function removeListener(event, fn) {
  assert(this.listeners[event], `Trying to remove listener from invalid event: ${event}`);
  this.listeners[event].delete(fn);
}

/**
 * @method trigger
 * @param  {String} event
 */
function trigger(event) {
  this.listeners[event].forEach(fn => fn(this));
}
