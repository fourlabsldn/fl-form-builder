# fl-form-builder
[![Build Status](https://travis-ci.org/fourlabsldn/fl-form-builder.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-form-builder)

A native JS form builder **inspired by Google Forms**.

- **[Read the docs](https://fourlabsldn.github.io/fl-form-builder/)**
- **[Demo](https://fourlabsldn.github.io/fl-form-builder/demo/)**

## Getting started
### Creating a form-builder
Just load the javascript and the CSS and call `new FormBuilder(container)`, using the
`FormBuilder` global object.

```html
<!-- RequireJS -->
<link rel="stylesheet" href="../dist/fl-form-builder.css">
<script src="../dist/fl-form-builder.js"></script>

<div class="form-builder-container"></div>

<script>
  var container = document.querySelector('.form-builder-container');
  const formBuilder = new FormBuilder(container);
</script>
```

### Saving the form state
To save the created form just store the object – or a serialization of it – returned by `formBuilder.exportState()`.

``` javascript
  // exporting
  const state = formBuilder.exportState();
```

### Restoring a form state
If you want to get the form-builder back to the way it was when the user last used it, you can just import the state you saved with the `importState` method. You could, for example, do that when the form loads.

``` javascript
  // importing
  const formBuilder = new FormBuilder(container);
  formBuilder.importState(state);
```

## Docs
Have a look at the [documentation](https://fourlabsldn.github.io/fl-form-builder/) to see a bit more of `importState` and `exportState`.

