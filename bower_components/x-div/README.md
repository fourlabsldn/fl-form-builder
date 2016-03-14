# x-div Web Component

Check for browser compatibility  [here](http://caniuse.com/#feat=custom-elements "can I use: custom elements").

Use it like:

**myPage.html**
```html
  <x-div data-controller="js/mycontroller.js"> </x-div>
```
***mycontroller.js***
```javascript
  xController(function (element){    
    var whoisThis = (this === element) ? true : false; //true;
  });
```

The xController receives a callback which receives the element it is inserted
into as an argument.

## Installation
**NPM**
```
npm install x-div
```
**Bower**

```
bower install x-div
```

## Testing
To test your x-div components just load `x-div-tester.js` instead of `x-div.js`
and load your controller file with a `<script>` tag. The tester will not execute
your component immediately, but store if to be executed by the test code.

Execute your component with `xDivTester.callWith()`, and provire an HTMLElement
as a parameter to be the target of the execution
