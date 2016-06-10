# fl-form-builder
[![Build Status](https://travis-ci.org/fourlabsldn/fl-multi-calendar.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-multi-calendar)

A native JS form builder

- **[Read the docs](https://fourlabsldn.github.io/fl-form-builder/)**
- **[Demo](https://fourlabsldn.github.io/fl-form-builder/demo/)**

## Getting started
### Creating a form-builder
To create a form builder just insert the [`x-div`](https://github.com/fourlabsldn/x-div) element to the page as such:

``` javascript
<x-div data-controller="../dist/fl-form-builder"> </x-div>
```

### Catching the form-builder element
The form-builder element will emmit an event called `formBuilderLoaded`, which will contain an instance of the `ModuleCoordinator` element used to control the form. You can retrieve this instance like this:

``` javascript
document.addEventListener('formBuilderLoaded', (e) => {
  const formBuilder = e.detail.instance;
});
```

### Saving the form state
When the user clicks on the save button the `formBuilderSave` event will be fired containing an object representing the current form state. This is the element that you will want to save in the database so that you can later reconstruct the form that was built.

``` javascript
document.addEventListener('formBuilderSave', (e) => {
  const formState = e.detail.formState;
});
```

You can also retrieve the current form state at any moment by calling the `exportState` method on your `formBuilder` instance.

``` javascript
const formState = formBuilder.exportState();
```

### Restoring a form state
If you want to get the form-builder back to the way it was when the user last used it, you can just import the state you saved with the `importState` method. You could, for example, do that when the form loads.

``` javascript
document.addEventListener('formBuilderLoaded', (e) => {
  const formBuilder = e.detail.instance;
  formBuilder.importState(mySavedState);
});
```

## Docs
Give a look at the [documentation](https://fourlabsldn.github.io/fl-form-builder/) to see a bit more of `importState` and `exportState`
