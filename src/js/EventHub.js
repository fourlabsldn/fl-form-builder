import assert from 'fl-assert';

//
//
//     Singleton
//
//

const listeners = {};

function on(eventName, func) {
  listeners[eventName] = listeners[eventName]
    ? listeners[eventName].concat([func])
    : [func];
}

function trigger(eventName, data) {
  assert.warn(listeners[eventName], `No one listening to "${eventName}."`);
  listeners[eventName].forEach(f => f(data));
}

const EventHub = {
  on,
  trigger,
};


export default EventHub;
